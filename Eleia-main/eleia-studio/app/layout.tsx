import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://eleia.vercel.app'),
  title: {
    default: 'Eleia - Gestion de Studio de Pilates',
    template: '%s | Eleia'
  },
  description: 'Solution moderne de gestion pour studios de Pilates. Réservations en ligne, suivi des abonnements, tableau de bord complet.',
  keywords: ['eleia', 'pilates', 'gestion studio', 'réservation', 'abonnement', 'reformer', 'logiciel', 'saas'],
  authors: [{ name: 'Eleia' }],
  creator: 'Eleia',
  publisher: 'Eleia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Eleia - Gestion de Studio de Pilates',
    description: 'Solution moderne de gestion pour studios de Pilates',
    url: 'https://eleia.vercel.app',
    siteName: 'Eleia',
    images: [
      {
        url: 'https://eleia.vercel.app/og.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'fr_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eleia',
    description: 'Solution moderne de gestion pour studios de Pilates',
    images: ['https://eleia.vercel.app/twitter-image.jpg'],
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-CH': '/fr',
      'de-CH': '/de',
      'it-CH': '/it',
      'en-CH': '/en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}