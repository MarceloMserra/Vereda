import { NextRequest, NextResponse } from 'next/server'
import { getDiaPlano } from '@/lib/plano'
import { buscarCapitulo, parsearCapitulos } from '@/lib/biblia'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dia = parseInt(searchParams.get('dia') ?? '1')

  const plano = getDiaPlano(dia)
  if (!plano) {
    return NextResponse.json({ error: 'Dia inválido' }, { status: 400 })
  }

  const numeros = parsearCapitulos(plano.capitulos)

  const capitulos = await Promise.all(
    numeros.map((n) => buscarCapitulo(plano.livro, n))
  )

  const validos = capitulos.filter(Boolean)

  if (validos.length === 0) {
    return NextResponse.json({ error: 'Texto não encontrado' }, { status: 404 })
  }

  return NextResponse.json({
    livro: plano.livro,
    capitulos: validos,
  })
}
