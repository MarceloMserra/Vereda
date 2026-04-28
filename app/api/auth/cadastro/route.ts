import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const { nome, email, senha } = await request.json()

  if (!nome?.trim() || !email?.trim() || !senha?.trim()) {
    return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 })
  }
  if (senha.length < 6) {
    return NextResponse.json({ error: 'A senha precisa ter ao menos 6 caracteres' }, { status: 400 })
  }

  const existente = await prisma.usuario.findUnique({ where: { email: email.trim().toLowerCase() } })
  if (existente) {
    return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 })
  }

  const hash = await bcrypt.hash(senha, 10)
  const usuario = await prisma.usuario.create({
    data: { nome: nome.trim(), email: email.trim().toLowerCase(), senha: hash },
  })

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
