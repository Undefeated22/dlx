import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const protocol =
  process.env.NODE_ENV === "production" ? "https" : "http";

export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }
    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }
    return null;
  }

  const rootDomainFormatted = rootDomain.split(":")[0];
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

export default clerkMiddleware((auth, request) => {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain && !pathname.startsWith(`/s/${subdomain}`)) {
    return NextResponse.rewrite(
      new URL(`/s/${subdomain}${pathname}`, request.url)
    );
  }

  return NextResponse.next(); // Normal behavior
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
