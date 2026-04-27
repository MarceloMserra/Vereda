import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const usuarioId = searchParams.get('usuarioId')

  if (!usuarioId) {
    return NextResponse.json({ error: 'usuarioId obrigatório' }, { status: 400 })
  }

  const progressos = await prisma.progresso.findMany({
    where: { usuarioId },
    orderBy: { dia: 'asc' },
  })

  const diasLidos = progressos.map((p) => p.dia)

  // Calcular streak
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  let streak = 0

  const progressosPorData = await prisma.progresso.findMany({
    where: { usuarioId },
    orderBy: { lidoEm: 'desc' },
  })

  const datasUnicas = [
    ...new Set(
      progressosPorData.map((p) => {
        const d = new Date(p.lidoEm)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    ),
  ].sort((a, b) => b - a)

  const umDia = 86400000
  for (let i = 0; i < datasUnicas.length; i++) {
    const esperado = hoje.getTime() - i * umDia
    if (datasUnicas[i] === esperado) {
      streak++
    } else {
      break
    }
  }

  return NextResponse.json({ diasLidos, streak, total: diasLidos.length })
}

export async function POST(request: NextRequest) {
  const { usuarioId, dia } = await request.json()

  if (!usuarioId || !dia) {
    return NextResponse.json({ error: 'usuarioId e dia obrigatórios' }, { status: 400 })
  }

  // Garantir que o usuário existe
  await prisma.usuario.upsert({
    where: { id: usuarioId },
    create: { id: usuarioId },
    update: {},
  })

  const progresso = await prisma.progresso.upsert({
    where: { usuarioId_dia: { usuarioId, dia } },
    create: { usuarioId, dia },
    update: { lidoEm: new Date() },
  })

  return NextResponse.json(progresso)
}

export async function DELETE(request: NextRequest) {
  const { usuarioId, dia } = await request.json()

  if (!usuarioId || !dia) {
    return NextResponse.json({ error: 'usuarioId e dia obrigatórios' }, { status: 400 })
  }

  await prisma.progresso.deleteMany({
    where: { usuarioId, dia },
  })

  return NextResponse.json({ ok: true })
}
