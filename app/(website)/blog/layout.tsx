import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'The Dispatch | SaaSPebble',
  description:
    'In-depth analytical essays, procurement philosophies, and licensing trap guides from the SaaSPebble editorial team. Updated weekly.',
  alternates: { canonical: 'https://saaspebble.tech/blog' },
  openGraph: {
    title: 'The Dispatch | SaaSPebble',
    description:
      'In-depth analytical essays, procurement philosophies, and licensing trap guides from the SaaSPebble editorial team.',
    type: 'website',
    url: 'https://saaspebble.tech/blog',
    siteName: 'SaaSPebble',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Dispatch | SaaSPebble',
    description:
      'In-depth analytical essays, procurement philosophies, and licensing trap guides from the SaaSPebble editorial team.',
  },
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
