import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'SaaS Reviews | SaaSPebble',
  description:
    'Browse every verified side-by-side B2B software comparison on file. Independently sandbox-tested reviews with zero sponsored placements, updated weekly.',
  alternates: { canonical: 'https://saaspebble.tech/reviews' },
  openGraph: {
    title: 'SaaS Reviews | SaaSPebble',
    description:
      'Browse every verified side-by-side B2B software comparison on file. Independently sandbox-tested, zero sponsored placements.',
    type: 'website',
    url: 'https://saaspebble.tech/reviews',
    siteName: 'SaaSPebble',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Reviews | SaaSPebble',
    description:
      'Browse every verified side-by-side B2B software comparison. Zero sponsored placements.',
  },
}

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
