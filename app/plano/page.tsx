'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUsuario } from '@/hooks/useUsuario'
import { PLANO_LEITURA as todosOsDias, getTotalDias } from '@/lib/plano'
import Navegacao from '@/components/Navegacao'

export default function PaginaPlano() {
  const usuarioId = useUsuario()
  const [diasLidos, setDiasLidos] = useState<Set<number>>(new Set())
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<'todos' | 'lidos' | 'pendentes'>('todos')

  const carregarProgresso = useCallback(async () => {
    if (!usuarioId) return
    try {
      const res = await fetch('/api/progresso')
      const data = await res.json()
      setDiasLidos(new Set(data.diasLidos ?? []))
    } catch {
      // silencioso
    }
  }, [usuarioId])

  useEffect(() => {
    carregarProgresso()
  }, [carregarProgresso])

  const diasFiltrados = todosOsDias.filter((d) => {
    const termoBusca = busca.toLowerCase()
    const bate =
      !termoBusca ||
      d.livro.toLowerCase().includes(termoBusca) ||
      d.capitulos.toLowerCase().includes(termoBusca)
    const lido = diasLidos.has(d.dia)
    if (filtro === 'lidos') return bate && lido
    if (filtro === 'pendentes') return bate && !lido
    return bate
  })

  const totalLidos = diasLidos.size
  const total = getTotalDias()

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        <header>
          <h1 className="text-xl font-bold text-gradient">Plano de Leitura</h1>
          <p className="text-xs text-vereda-muted mt-0.5">
            {totalLidos} de {total} dias concluídos
          </p>
        </header>

        {/* Barra de progresso */}
        <div className="h-1.5 bg-vereda-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500"
            style={{ width: `${(totalLidos / total) * 100}%` }}
          />
        </div>

        {/* Filtros e busca */}
        <div className="space-y-2">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar livro..."
            className="w-full bg-vereda-card border border-vereda-border rounded-xl px-3 py-2 text-sm text-gray-200
                       placeholder:text-vereda-muted focus:outline-none focus:border-gold-600 transition-colors"
          />
          <div className="flex gap-2">
            {(['todos', 'lidos', 'pendentes'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  filtro === f
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                    : 'bg-vereda-card text-vereda-muted border border-vereda-border hover:text-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {diasFiltrados.map((d) => {
            const lido = diasLidos.has(d.dia)
            return (
              <div
                key={d.dia}
                className={`card flex items-center gap-3 py-3 transition-opacity ${
                  lido ? 'opacity-60' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  lido
                    ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40'
                    : 'bg-vereda-border text-vereda-muted'
                }`}>
                  {lido ? '✓' : d.dia}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">{d.livro}</p>
                  <p className="text-xs text-vereda-muted truncate">{d.capitulos}</p>
                </div>
                <span className={d.testamento === 'AT' ? 'tag-at' : 'tag-nt'}>
                  {d.testamento}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <Navegacao />
    </main>
  )
}
