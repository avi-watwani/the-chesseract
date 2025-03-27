import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Chesseract',
  description: 'Elevate your chess game with our multidimensional approach to learning and mastery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  )
} 