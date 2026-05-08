import type { ReactNode } from 'react'
import { Header } from './Header'

interface PageLayoutProps {
  children: ReactNode
  showHeader?: boolean
}

export function PageLayout({ children, showHeader = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white scanline-field">
      {showHeader && <Header />}
      {children}
    </div>
  )
}
