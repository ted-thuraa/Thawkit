import { Worker, Job } from "bullmq";
import { chromium, Browser } from "playwright";
import { UTApi } from "uploadthing/server";

import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { cleanupQueue, connection } from "@/lib/queue";
import { funnelPages, projects } from "@/drizzle/schema";

// sharp is a CommonJS module, so we use require
const sharp = require("sharp");

// Initialize UploadThing API
const utapi = new UTApi();

// Global Browser Instance (Singleton Pattern)
// This prevents launching a new browser for every single job, saving massive CPU/RAM.
let browserInstance: Browser | null = null;

const isDev = process.env.NODE_ENV === "development";

/**
 * Helper to get or launch the shared browser instance.
 */
async function getBrowser() {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  console.log("🚀 Launching new shared Browser instance...");
  browserInstance = await chromium.launch({
    headless: !isDev, // Headless in prod, visible in dev (optional)
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // Helps in Docker/limited resource envs
      "--disable-gpu",
    ],
  });
  return browserInstance;
}

// 1. Preview Generation Worker (Heavy task)
const previewWorker = new Worker(
  "preview-generation",
  async (job: Job) => {
    const { pageId, projectId, pageUrl, pageContext, oldPreviewUrl } = job.data;
    console.log(`[Job ${job.id}] Starting preview for Page ID: ${pageId}`);

    // Get the shared browser instance
    const browser = await getBrowser();
    // CONFIGURATION: This defines the exact dimensions of your screenshot.
    // If you want the image to be exactly 1280x800, set it here.
    const VIEWPORT_WIDTH = 1280;
    const VIEWPORT_HEIGHT = 800;

    // Create a new Incognito Context for this specific job
    // This ensures no cookies/session data leaks between jobs
    const context = await browser.newContext({
      viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
      deviceScaleFactor: 1,
    });

    try {
      const page = await context.newPage();
      // Auth Bypass URL
      const authUrl = `${pageUrl}?preview_secret=${process.env.PLAYRIGHT_PREVIEW_SECRET_TOKEN}`;
      const timeout = isDev ? 60000 : 30000;

      await page.setExtraHTTPHeaders({
        "x-preview-secret": process.env
          .PLAYRIGHT_PREVIEW_SECRET_TOKEN as string,
      });

      // OPTIMIZATION: Wait for 'domcontentloaded' instead of 'networkidle'
      // 'networkidle' waits for 500ms of no network activity, which often causes timeouts if you have analytics/chat widgets.
      await page.goto(authUrl, {
        waitUntil: "load",
        timeout: timeout,
      });

      // STEP 2: Ensure fonts are fully rendered
      // This prevents capturing the screenshot while webfonts are still swapping.
      try {
        await page.evaluate(() => document.fonts.ready);
      } catch (e) {
        console.warn(`[Job ${job.id}] Font ready check timed out, proceeding.`);
      }

      // STEP 3: Simple Viewport Screenshot
      // 'fullPage: false' ensures we only capture the 1280x800 area we defined above.
      console.log(`[Job ${job.id}] Capturing viewport...`);
      const buffer = await page.screenshot({
        fullPage: false,
        type: "png",
      });

      // OPTIMIZATION: Explicitly wait for the hero selector to appear
      // If it doesn't appear in 5s, we proceed to fallback immediately.
      // try {
      //   await page.waitForSelector(heroSelector, {
      //     state: "visible",
      //     timeout: 5000,
      //   });
      // } catch (e) {
      //   console.warn(
      //     `[Job ${job.id}] Hero selector "${heroSelector}" not found or timed out. Falling back.`
      //   );
      // }

      // Selector Search
      //let elementHandle = await page.$(heroSelector);
      //let buffer: Buffer;

      // if (elementHandle) {
      //   // Capture specific element
      //   buffer = await elementHandle.screenshot({ type: "png" });
      // } else {
      //   // Fallback: Capture Body, but restrict height
      //   // 'fullPage: false' ensures we don't capture a 5000px height image if the page is long
      //   console.log(`[Job ${job.id}] Capturing viewport fallback.`);
      //   buffer = await page.screenshot({ fullPage: false, type: "png" });
      // }

      // STEP 4: Optimize with Sharp
      // Since we already captured the exact size we wanted (1280x800),
      // we might only need to convert format or ensure it fits strict limits.
      const optimizedBuffer = await sharp(buffer)
        .resize({
          width: 1200,
          height: 800, // Enforce a max height to keep aspect ratio sane
          fit: "inside", // Maintain aspect ratio, do not crop
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      // 3. Upload to UploadThing
      const file = new File([optimizedBuffer], `preview-${pageId}.webp`, {
        type: "image/webp",
      });

      const response = await utapi.uploadFiles([file]);
      if (!response[0]?.data?.url) {
        throw new Error("UploadThing upload failed");
      }

      const newImageUrl = response[0].data.url;
      // We don't strictly need newImageKey for DB, but good to have if you need it later
      // const newImageKey = response[0].data.key;

      // 4. Update Database
      await db
        .update(funnelPages)
        .set({ previewImage: newImageUrl, updatedAt: new Date() })
        .where(eq(funnelPages.id, pageId));

      if (pageContext === "Landing_Page") {
        await db
          .update(projects)
          .set({ previewImage: newImageUrl, updatedAt: new Date() })
          .where(eq(projects.id, projectId));
      }

      // 5. Enqueue Cleanup
      if (
        oldPreviewUrl &&
        typeof oldPreviewUrl === "string" &&
        oldPreviewUrl.includes("uploadthing")
      ) {
        const urlParts = oldPreviewUrl.split("/");
        const oldKey = urlParts[urlParts.length - 1]?.split(".")[0];

        if (oldKey && oldKey.length > 5) {
          await cleanupQueue.add("delete-old", { fileKey: oldKey });
        }
      }

      console.log(`[Job ${job.id}] Success: ${newImageUrl}`);
      return { url: newImageUrl };
    } catch (error) {
      console.error(`[Job ${job.id}] Critical Failure:`, error);
      throw error;
    } finally {
      // CRITICAL: Close the Context, NOT the Browser.
      // This frees up the tab/memory, but keeps the browser running for the next job.
      await context.close();
    }
  },
  {
    connection,
    // OPTIMIZATION: Concurrency increased to 5.
    // Since we reuse the browser, we can handle more parallel jobs without crashing.
    concurrency: 5,
  }
);

// 6. Cleanup Worker (Shares the same process, but handles a different queue)
const cleanupWorker = new Worker(
  "preview-cleanup",
  async (job: Job) => {
    const { fileKey } = job.data;
    if (!fileKey) return;

    try {
      await utapi.deleteFiles(fileKey);
      console.log(`[Cleanup] Deleted old preview: ${fileKey}`);
    } catch (err) {
      console.warn("[Cleanup] Failed (may be harmless):", err);
    }
  },
  { connection }
);

// Graceful Shutdown
// Ensure we close the browser when the Node process terminates
process.on("SIGTERM", async () => {
  if (browserInstance) {
    await browserInstance.close();
  }
  process.exit(0);
});

console.log(
  `Worker Service Initialized (${process.env.NODE_ENV}). Listening for jobs...`
);
