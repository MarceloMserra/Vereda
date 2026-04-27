'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Hoje', icon: '☀️' },
  { href: '/plano', label: 'Plano', icon: '📅' },
  { href: '/diario', label: 'Diário', icon: '📖' },
]

export default function Navegacao() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-vereda-border">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {links.map(({ href, label, icon }) => {
          const ativo = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
                ativo
                  ? 'text-gold-400'
                  : 'text-vereda-muted hover:text-gray-300'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
