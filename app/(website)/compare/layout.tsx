import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Compare SaaS Tools | SaaSPebble',
  description:
    'Build custom side-by-side comparison matrices for any two B2B software platforms. Compare sandbox pricing, integration hooks, and performance ratings instantly.',
  alternates: { canonical: 'https://saaspebble.tech/compare' },
  openGraph: {
    title: 'Compare SaaS Tools | SaaSPebble',
    description:
      'Build custom side-by-side comparison matrices for any two B2B software platforms.',
    type: 'website',
    url: 'https://saaspebble.tech/compare',
    siteName: 'SaaSPebble',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare SaaS Tools | SaaSPebble',
    description:
      'Build custom side-by-side comparison matrices for any two B2B software platforms.',
  },
}

export default function CompareLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
