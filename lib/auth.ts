import { cookies } from 'next/headers'
import { prisma } from './db'

export type UsuarioAtual = { id: string; nome: string; email: string }

export async function getUsuarioAtual(): Promise<UsuarioAtual | null> {
  const token = cookies().get('vereda_sessao')?.value
  if (!token) return null

  const sessao = await prisma.sessao.findUnique({
    where: { token },
    include: { usuario: true },
  })

  if (!sessao || sessao.expiraEm < new Date()) return null

  return {
    id: sessao.usuario.id,
    nome: sessao.usuario.nome ?? '',
    email: sessao.usuario.email ?? '',
  }
}
