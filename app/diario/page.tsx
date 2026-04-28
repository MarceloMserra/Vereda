'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUsuario } from '@/hooks/useUsuario'
import { getDiaPlano } from '@/lib/plano'
import Navegacao from '@/components/Navegacao'

interface EntradaDiario {
  id: string
  dia: number
  texto: string
  criadoEm: string
}

export default function PaginaDiario() {
  const usuarioId = useUsuario()
  const [entradas, setEntradas] = useState<EntradaDiario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [expandido, setExpandido] = useState<string | null>(null)

  const carregarEntradas = useCallback(async () => {
    if (!usuarioId) return
    setCarregando(true)
    try {
      const res = await fetch('/api/diario')
      const data = await res.json()
      setEntradas(data ?? [])
    } catch {
      // silencioso
    } finally {
      setCarregando(false)
    }
  }, [usuarioId])

  useEffect(() => {
    carregarEntradas()
  }, [carregarEntradas])

  const formatarData = (iso: string) => {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        <header>
          <h1 className="text-xl font-bold text-gradient">Diário de Oração</h1>
          <p className="text-xs text-vereda-muted mt-0.5">
            {entradas.length} {entradas.length === 1 ? 'entrada' : 'entradas'} registradas
          </p>
        </header>

        {carregando ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card space-y-2">
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-4/5" />
              </div>
            ))}
          </div>
        ) : entradas.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 text-center py-10">
            <span className="text-4xl">📖</span>
            <p className="text-sm text-gray-300 font-medium">Nenhuma entrada ainda</p>
            <p className="text-xs text-vereda-muted">
              Após ler, anote o que Deus falou com você na leitura do dia
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entradas.map((entrada) => {
              const plano = getDiaPlano(entrada.dia)
              const aberto = expandido === entrada.id
              return (
                <div key={entrada.id} className="card space-y-2">
                  <button
                    onClick={() => setExpandido(aberto ? null : entrada.id)}
                    className="w-full flex items-start justify-between gap-3 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-vereda-muted">Dia {entrada.dia}</span>
                        {plano && (
                          <span className={plano.testamento === 'AT' ? 'tag-at' : 'tag-nt'}>
                            {plano.testamento}
                          </span>
                        )}
                      </div>
                      {plano && (
                        <p className="text-sm font-semibold text-gray-200">
                          {plano.livro} — {plano.capitulos}
                        </p>
                      )}
                      <p className="text-xs text-vereda-muted mt-0.5">
                        {formatarData(entrada.criadoEm)}
                      </p>
                    </div>
                    <span className={`text-vereda-muted text-sm transition-transform duration-200 mt-1 ${aberto ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {aberto && (
                    <div className="pt-2 border-t border-vereda-border animate-fade-in">
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {entrada.texto}
                      </p>
                    </div>
                  )}

                  {!aberto && (
                    <p className="text-xs text-vereda-muted line-clamp-2">{entrada.texto}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Navegacao />
    </main>
  )
}
