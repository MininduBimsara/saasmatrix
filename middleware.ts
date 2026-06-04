import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Prevent MIME-type sniffing attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Block all framing to prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Legacy XSS filter for older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Only send origin on cross-origin requests
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Disable access to sensitive browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // Enforce HTTPS for 1 year, include subdomains
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    // Next.js requires unsafe-inline for its runtime; unsafe-eval for certain SSR features
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://adservice.google.com https://*.adtrafficquality.google https://*.googlesyndication.com https://*.doubleclick.net",
    "style-src 'self' 'unsafe-inline'",
    // Allow images from HTTPS origins plus data URIs and blobs (for icon previews)
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    // Supabase REST + WebSocket, Lemon Squeezy, Gemini AI endpoints, FormSubmit
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.lemonsqueezy.com https://generativelanguage.googleapis.com https://*.adtrafficquality.google https://*.doubleclick.net https://*.googlesyndication.com https://pagead2.googlesyndication.com https://formsubmit.co",
    // AdSense iframes
    "frame-src https://*.doubleclick.net https://*.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.adtrafficquality.google https://*.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  /*
   * Limit routing execution rules to intercept structural pages exclusively.
   * Do not run middle scripts over static media paths, stylesheet links, or system maps.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|ads.txt|robots.txt|.*\\.(?:svg|png|jpg|jpeg|webp|avif)$).*)",
  ],
};
