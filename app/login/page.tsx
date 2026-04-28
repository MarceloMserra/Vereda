'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function PaginaLogin() {
  const router = useRouter()
  const [aba, setAba] = useState<'entrar' | 'cadastro'>('entrar')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const url = aba === 'entrar' ? '/api/auth/login' : '/api/auth/cadastro'
    const body = aba === 'entrar' ? { email, senha } : { nome, email, senha }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.error ?? 'Erro inesperado')
      } else {
        router.replace('/')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gradient">Vereda</h1>
          <p className="text-sm text-vereda-muted">Leitura Bíblica Diária</p>
        </div>

        {/* Card */}
        <div className="card space-y-5">

          {/* Abas */}
          <div className="flex rounded-xl overflow-hidden border border-vereda-border">
            {(['entrar', 'cadastro'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setAba(a); setErro('') }}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  aba === a
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-vereda-muted hover:text-gray-300'
                }`}
              >
                {a === 'entrar' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {/* Formulário */}
          <form onSubmit={enviar} className="space-y-4">
            {aba === 'cadastro' && (
              <div className="space-y-1">
                <label className="text-xs text-vereda-muted">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full bg-vereda-bg border border-vereda-border rounded-xl px-3 py-2.5 text-sm text-gray-200
                             placeholder:text-vereda-muted focus:outline-none focus:border-gold-600 transition-colors"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-vereda-muted">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-vereda-bg border border-vereda-border rounded-xl px-3 py-2.5 text-sm text-gray-200
                           placeholder:text-vereda-muted focus:outline-none focus:border-gold-600 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-vereda-muted">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={aba === 'cadastro' ? 'Mínimo 6 caracteres' : '••••••••'}
                required
                className="w-full bg-vereda-bg border border-vereda-border rounded-xl px-3 py-2.5 text-sm text-gray-200
                           placeholder:text-vereda-muted focus:outline-none focus:border-gold-600 transition-colors"
              />
            </div>

            {erro && (
              <p className="text-xs text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full"
            >
              {carregando
                ? 'Aguarde...'
                : aba === 'entrar' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
