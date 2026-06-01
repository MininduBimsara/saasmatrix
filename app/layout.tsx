import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Load Inter smoothly with swap configuration to prevent Cumulative Layout Shift (CLS)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SaaSRooms | Top B2B Software Index & Performance Matrices",
  description:
    "Unbiased side-by-side SaaS comparison arrays, ratings, and matrix reports optimized for software buying decisions.",
  metadataBase: new URL("https://saasrooms.co"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Establish connection handshakes with Google's ad servers to keep latency minimal */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
      </head>
      <body
        className="font-sans text-slate-600 bg-white antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {/* Production-Ready Google AdSense Tag Wrapper (Preloaded non-blocking after interactive hydration) */}
        {/* Change client ID ca-pub-XXXXX when custom domain is authorized by Google policy */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-your-partner-id"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
