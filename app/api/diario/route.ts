import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUsuarioAtual } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const usuario = await getUsuarioAtual()
  if (!usuario) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const diaParam = searchParams.get('dia')

  if (diaParam) {
    const dia = parseInt(diaParam)
    const entrada = await prisma.diario.findUnique({
      where: { usuarioId_dia: { usuarioId: usuario.id, dia } },
    })
    return NextResponse.json(entrada ?? null)
  }

  const entradas = await prisma.diario.findMany({
    where: { usuarioId: usuario.id },
    orderBy: { dia: 'desc' },
  })
  return NextResponse.json(entradas)
}

export async function POST(request: NextRequest) {
  const usuario = await getUsuarioAtual()
  if (!usuario) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { dia, texto } = await request.json()
  if (!dia || !texto) return NextResponse.json({ error: 'dia e texto obrigatórios' }, { status: 400 })

  const entrada = await prisma.diario.upsert({
    where: { usuarioId_dia: { usuarioId: usuario.id, dia } },
    create: { usuarioId: usuario.id, dia, texto },
    update: { texto },
  })
  return NextResponse.json(entrada)
}
