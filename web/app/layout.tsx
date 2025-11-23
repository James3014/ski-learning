import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DIY Ski Assessment System',
  description: '滑雪教學評量系統',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className="dark">
      <body className="bg-background-light dark:bg-background-dark font-display">
        {children}
      </body>
    </html>
  )
}
