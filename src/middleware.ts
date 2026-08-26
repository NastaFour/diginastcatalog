import { NextRequest, NextResponse } from "next/server";
import { verifyCsrfToken } from "@/lib/csrf";
import { CSRF_COOKIE } from "@/lib/constants";

// ============================================================
// Middleware — Security headers + CSRF gate + glmpagina root rewrite
// ============================================================

const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// CSP: permite self, CDNs de Three.js / GSAP / Lenis, Google Fonts y Upstash
const CSP = [
  "default-src 'self' https://cdnjs.cloudflare.com https://unpkg.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.upstash.io wss://*.upstash.io https://*.uploadthing.com https://*.unsplash.com",
  "media-src 'self' https: data: blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const MUTATION_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. Root route: servir directamente el frontend original de glmpagina.html
  if (pathname === "/") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/glmpagina.html";
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("Content-Security-Policy", CSP);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  }

  // 2. Aplicar security headers a todas las responses
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Set security headers
  response.headers.set("Content-Security-Policy", CSP);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // 3. CSRF check para mutaciones a /api/*
  const isApiMutation =
    pathname.startsWith("/api/") &&
    MUTATION_METHODS.includes(request.method) &&
    !pathname.startsWith("/api/auth/login") &&
    !pathname.startsWith("/api/uploadthing");

  if (isApiMutation) {
    const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
    const headerToken = request.headers.get("x-csrf-token");

    if (!verifyCsrfToken(cookieToken, headerToken)) {
      return NextResponse.json(
        { error: "CSRF token validation failed" },
        { status: 403 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
