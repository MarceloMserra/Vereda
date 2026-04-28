'use client'

import { useEffect, useState } from 'react'

export type UsuarioAtual = { id: string; nome: string; email: string }

export function useUsuario(): UsuarioAtual | null {
  const [usuario, setUsuario] = useState<UsuarioAtual | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          window.location.href = '/login'
          return
        }
        setUsuario(data)
      })
      .catch(() => { window.location.href = '/login' })
  }, [])

  return usuario
}
