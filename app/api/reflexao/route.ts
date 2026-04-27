import { NextRequest, NextResponse } from 'next/server'
import { getDiaPlano } from '@/lib/plano'
import { gerarReflexao } from '@/lib/gemini'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dia = parseInt(searchParams.get('dia') ?? '1')

  const plano = getDiaPlano(dia)
  if (!plano) {
    return NextResponse.json({ error: 'Dia inválido' }, { status: 400 })
  }

  try {
    const reflexao = await gerarReflexao(plano.livro, plano.capitulos, plano.testamento)
    return NextResponse.json(reflexao)
  } catch (error) {
    console.error('Erro ao gerar reflexão:', error)
    return NextResponse.json({ error: 'Erro ao gerar reflexão' }, { status: 500 })
  }
}
