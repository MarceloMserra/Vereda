'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUsuario } from '@/hooks/useUsuario'
import { getDiaPlano, getTotalDias } from '@/lib/plano'
import type { ReflexaoIA } from '@/lib/gemini'
import StreakCard from '@/components/StreakCard'
import ReflexaoCard from '@/components/ReflexaoCard'
import DiarioOracao from '@/components/DiarioOracao'
import TextoBiblico from '@/components/TextoBiblico'
import Navegacao from '@/components/Navegacao'

export default function PaginaHoje() {
  const usuarioId = useUsuario()

  const [diasLidos, setDiasLidos] = useState<number[]>([])
  const [streak, setStreak] = useState(0)
  const [diaAtual, setDiaAtual] = useState(1)

  const [reflexao, setReflexao] = useState<ReflexaoIA | null>(null)
  const [carregandoReflexao, setCarregandoReflexao] = useState(false)

  const [marcando, setMarcando] = useState(false)
  const [lido, setLido] = useState(false)

  const totalDias = getTotalDias()
  const plano = getDiaPlano(diaAtual)

  const carregarProgresso = useCallback(async () => {
    if (!usuarioId) return
    try {
      const res = await fetch(`/api/progresso?usuarioId=${usuarioId}`)
      const data = await res.json()
      setDiasLidos(data.diasLidos ?? [])
      setStreak(data.streak ?? 0)

      // Determinar próximo dia a ler
      const proximo = (data.diasLidos as number[]).length + 1
      const dia = Math.min(proximo, totalDias)
      setDiaAtual(dia)
      setLido((data.diasLidos as number[]).includes(dia))
    } catch {
      // silencioso
    }
  }, [usuarioId, totalDias])

  useEffect(() => {
    carregarProgresso()
  }, [carregarProgresso])

  async function carregarReflexao() {
    setCarregandoReflexao(true)
    setReflexao(null)
    try {
      const res = await fetch(`/api/reflexao?dia=${diaAtual}`)
      const data = await res.json()
      setReflexao(data)
    } catch {
      // silencioso
    } finally {
      setCarregandoReflexao(false)
    }
  }

  async function marcarComoLido() {
    if (!usuarioId || lido) return
    setMarcando(true)
    try {
      await fetch('/api/progresso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, dia: diaAtual }),
      })
      setLido(true)
      setStreak((s) => s + 1)
      setDiasLidos((prev) => [...prev, diaAtual])
    } catch {
      // silencioso
    } finally {
      setMarcando(false)
    }
  }

  if (!usuarioId || !plano) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gradient">Vereda</h1>
            <p className="text-xs text-vereda-muted">Dia {diaAtual} de {totalDias}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gold-500/10 border border-gold-500/30 rounded-xl px-3 py-1.5">
            <span className="text-base">🔥</span>
            <span className="text-sm font-bold text-gold-400">{streak}</span>
          </div>
        </header>

        {/* Streak & Progresso */}
        <StreakCard streak={streak} total={diasLidos.length} totalDias={totalDias} />

        {/* Leitura do Dia */}
        <div className="card space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={plano.testamento === 'AT' ? 'tag-at' : 'tag-nt'}>
                  {plano.testamento === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {plano.livro}
              </h2>
              <p className="text-sm text-vereda-muted">{plano.capitulos}</p>
            </div>
            <div className="text-3xl">📜</div>
          </div>

          {lido ? (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-700/30 rounded-xl px-4 py-2.5">
              <span>✓</span>
              <span>Leitura concluída hoje!</span>
            </div>
          ) : (
            <button
              onClick={marcarComoLido}
              disabled={marcando}
              className="btn-primary w-full text-sm"
            >
              {marcando ? 'Marcando...' : 'Marcar como lido'}
            </button>
          )}
        </div>

        {/* Texto Bíblico */}
        <TextoBiblico dia={diaAtual} livro={plano.livro} capitulosRef={plano.capitulos} />

        {/* Reflexão IA */}
        <ReflexaoCard
          dia={diaAtual}
          reflexao={reflexao}
          carregando={carregandoReflexao}
          onCarregar={carregarReflexao}
        />

        {/* Diário */}
        <DiarioOracao dia={diaAtual} usuarioId={usuarioId} />

      </div>

      <Navegacao />
    </main>
  )
}
