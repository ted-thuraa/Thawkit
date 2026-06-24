import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { publicRoutes } from "./routes";

const isPathPublic = (pathname: string): boolean => {
  return publicRoutes.some((route) => {
    if (route.endsWith("/**")) {
      const baseRoute = route.slice(0, -3);
      return pathname.startsWith(baseRoute);
    }
    return route === pathname;
  });
};

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { nextUrl } = request;
  const { pathname } = request.nextUrl;
  const searchParams = nextUrl.searchParams.toString();
  const pathWithSearchParams = `${nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/trpc/") ||
    pathname.startsWith("/_next/")
  ) {
    return NextResponse.next();
  }

  // only playwright allowed in this route
  if (request.nextUrl.pathname.includes("/prev/")) {
    //const secret = request.nextUrl.searchParams.get('preview_secret');

    // Or check headers if you go with Option A
    const secret = request.headers.get("x-preview-secret");

    if (secret !== process.env.PLAYRIGHT_PREVIEW_SECRET_TOKEN) {
      // Return JSON error or 404 rewrite
      return new NextResponse(null, { status: 404 });
    }
  }

  // 1. Get Host and Domain
  const hostname = request.headers.get("host");
  // Ensure NEXT_PUBLIC_DOMAIN in .env is clean (e.g., "localhost:3000" or "domain.com")
  const baseDomain = process.env.NEXT_PUBLIC_DOMAIN;

  let customSubDomain;

  // 2. Extract Subdomain safely
  if (hostname && baseDomain && hostname !== baseDomain) {
    // Only process if hostname ends with the base domain (subdomain scenario)
    if (hostname.endsWith(`.${baseDomain}`)) {
      // Remove the domain AND the dot
      customSubDomain = hostname.replace(`.${baseDomain}`, "");
    }
  }

  // Debugging: Check your server logs to see exactly what is being extracted
  // console.log("Host:", hostname);
  // console.log("Extracted Subdomain:", customSubDomain);

  // 3. Rewrite to Subdomain Route
  if (customSubDomain) {
    // This rewrites the URL to: /subdomain-name/path...
    // Next.js will match this to src/app/[domain]/page.tsx
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, request.url)
    );
  }

  // --- STANDARD ROUTES BELOW ---

  // Handle Landing Page (Root domain)
  // If no subdomain, and we are at root, render landing page.
  if (nextUrl.pathname === "/" && hostname === baseDomain) {
    return NextResponse.rewrite(new URL("/", request.url));
  }

  // Prevent loops for the actual landing page route
  if (nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/payments/webhooks")) {
    return NextResponse.next();
  }

  if (sessionCookie && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  if (!sessionCookie && pathname.startsWith("/workspace")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
// Specify the routes the middleware applies to
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
