import { NextRequest, NextResponse } from 'next/server'
import { getDiaPlano } from '@/lib/plano'
import { perguntarSobreTexto } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  const { dia, pergunta } = await request.json()

  const plano = getDiaPlano(dia)
  if (!plano) {
    return NextResponse.json({ error: 'Dia inválido' }, { status: 400 })
  }

  if (!pergunta || typeof pergunta !== 'string') {
    return NextResponse.json({ error: 'Pergunta inválida' }, { status: 400 })
  }

  try {
    const resposta = await perguntarSobreTexto(pergunta, plano.livro, plano.capitulos)
    return NextResponse.json({ resposta })
  } catch (error) {
    console.error('Erro ao responder pergunta:', error)
    return NextResponse.json({ error: 'Erro ao processar pergunta' }, { status: 500 })
  }
}
