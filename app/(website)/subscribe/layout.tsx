import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Get Listed | SaaSPebble',
  description:
    'List your SaaS product in our verified B2B directory for Tier-1 backlinks and organic traffic. Access buyer intelligence tools with ROI calculators and comparison exports. Free during launch.',
  alternates: { canonical: 'https://saaspebble.tech/subscribe' },
  openGraph: {
    title: 'Get Listed | SaaSPebble',
    description:
      'List your SaaS product in our verified B2B directory for Tier-1 backlinks and organic traffic.',
    type: 'website',
    url: 'https://saaspebble.tech/subscribe',
    siteName: 'SaaSPebble',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Listed | SaaSPebble',
    description:
      'List your SaaS product in our verified B2B directory for Tier-1 backlinks and organic traffic.',
  },
}

export default function SubscribeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
