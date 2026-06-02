import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'SaaS ROI Calculator | SaaSPebble',
  description:
    'Free interactive calculator to determine if SaaS license costs deliver measurable productivity yield. Calculate payback period, ROI percentage, and net monthly benefit.',
  alternates: { canonical: 'https://saaspebble.tech/calculator' },
  openGraph: {
    title: 'SaaS ROI Calculator | SaaSPebble',
    description:
      'Free interactive calculator to determine if SaaS license costs deliver measurable productivity yield.',
    type: 'website',
    url: 'https://saaspebble.tech/calculator',
    siteName: 'SaaSPebble',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS ROI Calculator | SaaSPebble',
    description:
      'Free interactive calculator to determine if SaaS license costs deliver measurable productivity yield.',
  },
}

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
