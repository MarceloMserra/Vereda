import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const { email, senha } = await request.json()

  if (!email?.trim() || !senha?.trim()) {
    return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 })
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
  })

  if (!usuario || !usuario.senha) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
  }

  const ok = await bcrypt.compare(senha, usuario.senha)
  if (!ok) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
  }

  const token = crypto.randomUUID()
  const expiraEm = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await prisma.sessao.create({ data: { usuarioId: usuario.id, token, expiraEm } })

  const response = NextResponse.json({ ok: true })
  response.cookies.set('vereda_sessao', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })
  return response
}
