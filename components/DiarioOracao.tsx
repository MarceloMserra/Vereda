'use client'

import { useState, useEffect } from 'react'

interface DiarioOracaoProps {
  dia: number
  usuarioId: string
}

export default function DiarioOracao({ dia, usuarioId }: DiarioOracaoProps) {
  const [texto, setTexto] = useState('')
  const [salvo, setSalvo] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [expandido, setExpandido] = useState(false)

  useEffect(() => {
    if (!expandido) return
    fetch(`/api/diario?usuarioId=${usuarioId}&dia=${dia}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.texto) setTexto(data.texto)
      })
      .catch(() => {})
  }, [expandido, dia, usuarioId])

  async function salvar() {
    if (!texto.trim()) return
    setSalvando(true)
    try {
      await fetch('/api/diario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, dia, texto }),
      })
      setSalvo(true)
      setTimeout(() => setSalvo(false), 2000)
    } catch {
      // silencioso
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="card">
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📖</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-200">Diário de Oração</p>
            <p className="text-xs text-vereda-muted">Anote o que Deus falou com você hoje</p>
          </div>
        </div>
        <span className={`text-vereda-muted transition-transform duration-200 ${expandido ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {expandido && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="O que esse texto falou com você? Alguma promessa, desafio, ou palavra de encorajamento?"
            rows={5}
            className="w-full bg-vereda-bg border border-vereda-border rounded-xl px-3 py-2.5 text-sm text-gray-200
                       placeholder:text-vereda-muted focus:outline-none focus:border-gold-600 transition-colors resize-none"
          />
          <button
            onClick={salvar}
            disabled={salvando || !texto.trim()}
            className="btn-primary text-sm w-full"
          >
            {salvando ? 'Salvando...' : salvo ? '✓ Salvo!' : 'Salvar'}
          </button>
        </div>
      )}
    </div>
  )
}
