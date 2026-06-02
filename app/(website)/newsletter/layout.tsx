import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Dispatch Newsletter | SaaSPebble',
  description:
    'Join 14,000+ procurement executives receiving weekly SaaS audits, pricing change alerts, and exclusive licensing guides. Free PDF workbook included on signup.',
  alternates: { canonical: 'https://saaspebble.tech/newsletter' },
  openGraph: {
    title: 'Dispatch Newsletter | SaaSPebble',
    description:
      'Join 14,000+ procurement executives receiving weekly SaaS audits, pricing change alerts, and exclusive licensing guides.',
    type: 'website',
    url: 'https://saaspebble.tech/newsletter',
    siteName: 'SaaSPebble',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dispatch Newsletter | SaaSPebble',
    description:
      'Join 14,000+ procurement executives receiving weekly SaaS audits and exclusive licensing guides.',
  },
}

export default function NewsletterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
