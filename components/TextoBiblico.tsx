'use client'

import { useState } from 'react'
import type { Capitulo } from '@/lib/biblia'

interface TextoBiblicoProps {
  dia: number
  livro: string
  capitulosRef: string
}

export default function TextoBiblico({ dia, livro, capitulosRef }: TextoBiblicoProps) {
  const [capitulos, setCapitulos] = useState<Capitulo[]>([])
  const [carregando, setCarregando] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [erro, setErro] = useState(false)
  const [capituloAtivo, setCapituloAtivo] = useState(0)

  async function carregar() {
    if (capitulos.length > 0) {
      setAberto(true)
      return
    }
    setCarregando(true)
    setErro(false)
    try {
      const res = await fetch(`/api/biblia?dia=${dia}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCapitulos(data.capitulos ?? [])
      setCapituloAtivo(0)
      setAberto(true)
    } catch {
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  function fechar() {
    setAberto(false)
  }

  // Modal de leitura
  if (aberto && capitulos.length > 0) {
    const cap = capitulos[capituloAtivo]
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-vereda-bg">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-vereda-border flex-shrink-0">
          <div>
            <h2 className="font-bold text-white text-base">{livro}</h2>
            <p className="text-xs text-vereda-muted">Capítulo {cap.numero}</p>
          </div>
          <button
            onClick={fechar}
            className="w-8 h-8 flex items-center justify-center text-vereda-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>

        {/* Tabs de capítulos */}
        {capitulos.length > 1 && (
          <div className="flex gap-1 px-4 py-2 border-b border-vereda-border flex-shrink-0 overflow-x-auto">
            {capitulos.map((c, i) => (
              <button
                key={c.numero}
                onClick={() => setCapituloAtivo(i)}
                className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  i === capituloAtivo
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                    : 'text-vereda-muted hover:text-gray-300'
                }`}
              >
                Cap. {c.numero}
              </button>
            ))}
          </div>
        )}

        {/* Texto */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="max-w-prose mx-auto space-y-3 pb-10">
            {cap.versiculos.map((v) => (
              <p key={v.numero} className="text-gray-200 leading-7 text-[15px]">
                <span className="text-gold-500 font-bold text-xs mr-2 select-none">
                  {v.numero}
                </span>
                {v.texto}
              </p>
            ))}
          </div>
        </div>

        {/* Navegação entre capítulos */}
        {capitulos.length > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-vereda-border flex-shrink-0">
            <button
              onClick={() => setCapituloAtivo((i) => Math.max(0, i - 1))}
              disabled={capituloAtivo === 0}
              className="btn-ghost text-sm disabled:opacity-30"
            >
              ← Anterior
            </button>
            <span className="text-xs text-vereda-muted">
              {capituloAtivo + 1} / {capitulos.length}
            </span>
            <button
              onClick={() => setCapituloAtivo((i) => Math.min(capitulos.length - 1, i + 1))}
              disabled={capituloAtivo === capitulos.length - 1}
              className="btn-ghost text-sm disabled:opacity-30"
            >
              Próximo →
            </button>
          </div>
        )}
      </div>
    )
  }

  // Botão para abrir
  return (
    <div className="card flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📖</span>
        <div>
          <p className="text-sm font-semibold text-gray-200">Ler o texto de hoje</p>
          <p className="text-xs text-vereda-muted">
            {livro} {capitulosRef} — Almeida Revisada
          </p>
        </div>
      </div>
      <button
        onClick={carregar}
        disabled={carregando}
        className="btn-primary text-sm flex-shrink-0"
      >
        {carregando ? (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-gray-900 border-t-transparent rounded-full animate-spin" />
            Carregando
          </span>
        ) : erro ? (
          'Tentar novamente'
        ) : (
          'Abrir leitura'
        )}
      </button>
    </div>
  )
}
