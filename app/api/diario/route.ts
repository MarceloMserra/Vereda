import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const usuarioId = searchParams.get('usuarioId')
  const diaParam = searchParams.get('dia')

  if (!usuarioId) {
    return NextResponse.json({ error: 'usuarioId obrigatório' }, { status: 400 })
  }

  if (diaParam) {
    const dia = parseInt(diaParam)
    const entrada = await prisma.diario.findUnique({
      where: { usuarioId_dia: { usuarioId, dia } },
    })
    return NextResponse.json(entrada ?? null)
  }

  const entradas = await prisma.diario.findMany({
    where: { usuarioId },
    orderBy: { dia: 'desc' },
  })

  return NextResponse.json(entradas)
}

export async function POST(request: NextRequest) {
  const { usuarioId, dia, texto } = await request.json()

  if (!usuarioId || !dia || !texto) {
    return NextResponse.json({ error: 'usuarioId, dia e texto obrigatórios' }, { status: 400 })
  }

  // Garantir que o usuário existe
  await prisma.usuario.upsert({
    where: { id: usuarioId },
    create: { id: usuarioId },
    update: {},
  })

  const entrada = await prisma.diario.upsert({
    where: { usuarioId_dia: { usuarioId, dia } },
    create: { usuarioId, dia, texto },
    update: { texto },
  })

  return NextResponse.json(entrada)
}
