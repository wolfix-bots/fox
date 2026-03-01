import type { Metadata, Viewport } from 'next'
import { Nunito, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});
const _spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const viewport: Viewport = {
  themeColor: "#d97706",
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'Foxy AI - Your Clever AI Companion',
  description: 'Chat with Foxy, your friendly AI assistant by Foxy Tech. Fast, smart, and always ready to help!',
  generator: 'Foxy Tech',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_nunito.variable} ${_spaceMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
