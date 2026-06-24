import { headers } from "next/headers";
import crypto from "crypto";

// Exclude common bots to save DB space
const BOT_REGEX = /bot|googlebot|crawler|spider|robot|crawling/i;

export async function getAnalyticsContext() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // Vercel / Cloudflare standard headers
  const country =
    headersList.get("x-vercel-ip-country") ||
    headersList.get("cf-ipcountry") ||
    "XX";
  const referrer = headersList.get("referer") || "";

  return {
    ip,
    userAgent,
    country,
    referrer,
    isBot: BOT_REGEX.test(userAgent),
  };
}

/**
 * SHA-256 Hash of IP + Daily Salt.
 * Rotating salt daily prevents long-term tracking of specific IPs.
 */
export function hashIpAddress(ip: string): string {
  const dateSalt = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const secret = process.env.ANALYTICS_SALT || "dev-secret-key";
  return crypto
    .createHmac("sha256", secret + dateSalt)
    .update(ip)
    .digest("hex");
}
