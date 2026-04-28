import { NextResponse } from 'next/server'
import { getUsuarioAtual } from '@/lib/auth'

export async function GET() {
  const usuario = await getUsuarioAtual()
  if (!usuario) return NextResponse.json(null, { status: 401 })
  return NextResponse.json(usuario)
}
