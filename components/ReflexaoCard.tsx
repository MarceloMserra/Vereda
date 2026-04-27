'use client'

import { useState } from 'react'
import type { ReflexaoIA } from '@/lib/gemini'

interface ReflexaoCardProps {
  dia: number
  reflexao: ReflexaoIA | null
  carregando: boolean
  onCarregar: () => void
}

export default function ReflexaoCard({ dia, reflexao, carregando, onCarregar }: ReflexaoCardProps) {
  const [pergunta, setPergunta] = useState('')
  const [resposta, setResposta] = useState('')
  const [perguntando, setPerguntando] = useState(false)

  async function enviarPergunta() {
    if (!pergunta.trim()) return
    setPerguntando(true)
    setResposta('')
    try {
      const res = await fetch('/api/pergunta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dia, pergunta }),
      })
      const data = await res.json()
      setResposta(data.resposta ?? 'Não foi possível responder.')
    } catch {
      setResposta('Erro ao buscar resposta. Tente novamente.')
    } finally {
      setPerguntando(false)
    }
  }

  if (!reflexao && !carregando) {
    return (
      <div className="card flex flex-col items-center gap-4 text-center py-8">
        <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-2xl">
          ✨
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-200">Contexto & Reflexão</p>
          <p className="text-xs text-vereda-muted mt-1">
            Gerado por IA — entenda o que está lendo
          </p>
        </div>
        <button onClick={onCarregar} className="btn-primary text-sm">
          Gerar reflexão do dia
        </button>
      </div>
    )
  }

  if (carregando) {
    return (
      <div className="card space-y-4">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-3 w-4/5" />
        <div className="skeleton h-10 w-full mt-2" />
      </div>
    )
  }

  return (
    <div className="card space-y-5">
      {reflexao!.versiculo && (
        <blockquote className="border-l-2 border-gold-500 pl-4">
          <p className="text-sm text-gold-300 italic leading-relaxed">"{reflexao!.versiculo}"</p>
        </blockquote>
      )}

      <div className="space-y-1">
        <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider">Contexto Histórico</p>
        <p className="text-sm text-gray-300 leading-relaxed">{reflexao!.contexto}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider">Reflexão para Hoje</p>
        <p className="text-sm text-gray-300 leading-relaxed">{reflexao!.reflexao}</p>
      </div>

      <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-4">
        <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">Para meditar</p>
        <p className="text-sm text-gray-200 italic">{reflexao!.pergunta}</p>
      </div>

      {/* Perguntar ao pastor IA */}
      <div className="space-y-2 pt-2 border-t border-vereda-border">
        <p className="text-xs font-semibold text-vereda-muted uppercase tracking-wider">
          Tem alguma dúvida sobre o texto?
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarPergunta()}
            placeholder="Ex: O que significa a aliança de Deus aqui?"
            className="flex-1 bg-vereda-bg border border-vereda-border rounded-xl px-3 py-2 text-sm text-gray-200
                       placeholder:text-vereda-muted focus:outline-none focus:border-gold-600 transition-colors"
          />
          <button
            onClick={enviarPergunta}
            disabled={perguntando || !pergunta.trim()}
            className="btn-primary text-sm px-4"
          >
            {perguntando ? '...' : 'Enviar'}
          </button>
        </div>
        {resposta && (
          <div className="bg-vereda-bg border border-vereda-border rounded-xl p-3 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {resposta}
          </div>
        )}
      </div>
    </div>
  )
}
