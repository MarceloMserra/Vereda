import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST() {
  const token = cookies().get('vereda_sessao')?.value
  if (token) {
    await prisma.sessao.deleteMany({ where: { token } })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('vereda_sessao')
  return response
}
