// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import InstallButton from '@/components/InstallButton'

export const metadata: Metadata = {
  title: 'Ad Finance Manager',
  description: 'Finance manager for ad accounts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
            <h1 className="font-semibold">Ad Finance Manager</h1>
            <InstallButton />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
