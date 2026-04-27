'use client'

import { useEffect, useState } from 'react'

function gerarId(): string {
  return crypto.randomUUID()
}

export function useUsuario(): string | null {
  const [usuarioId, setUsuarioId] = useState<string | null>(null)

  useEffect(() => {
    let id = localStorage.getItem('vereda_usuario_id')
    if (!id) {
      id = gerarId()
      localStorage.setItem('vereda_usuario_id', id)
    }
    setUsuarioId(id)
  }, [])

  return usuarioId
}
