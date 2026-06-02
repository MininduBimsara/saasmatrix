import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contact | SaaSPebble',
  description:
    'Submit your B2B software for sandbox testing, report pricing discrepancies, or reach our editorial team for comparison matrix requests and listing inquiries.',
  alternates: { canonical: 'https://saaspebble.tech/contact' },
  openGraph: {
    title: 'Contact | SaaSPebble',
    description:
      'Submit your B2B software for sandbox testing or reach our editorial team for comparison matrix requests.',
    type: 'website',
    url: 'https://saaspebble.tech/contact',
    siteName: 'SaaSPebble',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | SaaSPebble',
    description:
      'Submit your B2B software for sandbox testing or reach our editorial team.',
  },
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
