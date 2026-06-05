import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import Script from "next/script";
import "./globals.css";

// Load Inter smoothly with swap configuration to prevent Cumulative Layout Shift (CLS)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SaaSPebble | Top B2B Software Index & Performance Matrices",
  description:
    "Unbiased side-by-side SaaS comparison arrays, ratings, and matrix reports optimized for software buying decisions.",
  metadataBase: new URL("https://saaspebble.tech"),
  alternates: {
    canonical: "https://saaspebble.tech",
  },
  openGraph: {
    title: "SaaSPebble | Top B2B Software Index & Performance Matrices",
    description:
      "Unbiased side-by-side SaaS comparison arrays, ratings, and matrix reports optimized for software buying decisions.",
    type: "website",
    url: "https://saaspebble.tech",
    siteName: "SaaSPebble",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSPebble | Top B2B Software Index & Performance Matrices",
    description:
      "Unbiased side-by-side SaaS comparison arrays, ratings, and matrix reports optimized for software buying decisions.",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SaaSPebble",
              url: "https://saaspebble.tech",
              description:
                "Independent B2B SaaS comparison index with sandbox-verified reviews and performance matrices.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "vetting@saaspebble.tech",
                contactType: "editorial",
              },
            }),
          }}
        />
      </head>
      <body
        className="font-sans text-slate-600 bg-white antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GSZG18F9RV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-GSZG18F9RV');
          `}
        </Script>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

