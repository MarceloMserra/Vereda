// Mapeamento do nome português → nome em inglês aceito pela bible-api.com
const LIVROS_EN: Record<string, string> = {
  // Antigo Testamento
  'Gênesis': 'genesis',
  'Êxodo': 'exodus',
  'Levítico': 'leviticus',
  'Números': 'numbers',
  'Deuteronômio': 'deuteronomy',
  'Josué': 'joshua',
  'Juízes': 'judges',
  'Rute': 'ruth',
  '1 Samuel': '1samuel',
  '2 Samuel': '2samuel',
  '1 Reis': '1kings',
  '2 Reis': '2kings',
  '1 Crônicas': '1chronicles',
  '2 Crônicas': '2chronicles',
  'Esdras': 'ezra',
  'Neemias': 'nehemiah',
  'Ester': 'esther',
  'Jó': 'job',
  'Salmos': 'psalms',
  'Provérbios': 'proverbs',
  'Eclesiastes': 'ecclesiastes',
  'Cantares': 'song+of+solomon',
  'Isaías': 'isaiah',
  'Jeremias': 'jeremiah',
  'Lamentações': 'lamentations',
  'Ezequiel': 'ezekiel',
  'Daniel': 'daniel',
  'Oséias': 'hosea',
  'Joel': 'joel',
  'Amós': 'amos',
  'Obadias': 'obadiah',
  'Jonas': 'jonah',
  'Miquéias': 'micah',
  'Naum': 'nahum',
  'Habacuque': 'habakkuk',
  'Sofonias': 'zephaniah',
  'Ageu': 'haggai',
  'Zacarias': 'zechariah',
  'Malaquias': 'malachi',
  // Novo Testamento
  'Mateus': 'matthew',
  'Marcos': 'mark',
  'Lucas': 'luke',
  'João': 'john',
  'Atos': 'acts',
  'Romanos': 'romans',
  '1 Coríntios': '1corinthians',
  '2 Coríntios': '2corinthians',
  'Gálatas': 'galatians',
  'Efésios': 'ephesians',
  'Filipenses': 'philippians',
  'Colossenses': 'colossians',
  '1 Tessalonicenses': '1thessalonians',
  '2 Tessalonicenses': '2thessalonians',
  '1 Timóteo': '1timothy',
  '2 Timóteo': '2timothy',
  'Tito': 'titus',
  'Filemom': 'philemon',
  'Hebreus': 'hebrews',
  'Tiago': 'james',
  '1 Pedro': '1peter',
  '2 Pedro': '2peter',
  '1 João': '1john',
  '2 João': '2john',
  '3 João': '3john',
  'Judas': 'jude',
  'Apocalipse': 'revelation',
}

export type Versiculo = {
  numero: number
  texto: string
}

export type Capitulo = {
  numero: number
  versiculos: Versiculo[]
}

/** Converte "1-3" → [1, 2, 3] ou "5" → [5] */
export function parsearCapitulos(capitulos: string): number[] {
  const partes = capitulos.split('-').map((s) => parseInt(s.trim()))
  if (partes.length === 1) return partes
  const [inicio, fim] = partes
  return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i)
}

/** Busca um capítulo da bible-api.com — chamar do lado servidor */
export async function buscarCapitulo(
  livro: string,
  capitulo: number
): Promise<Capitulo | null> {
  const livroEn = LIVROS_EN[livro]
  if (!livroEn) return null

  try {
    const url = `https://bible-api.com/${livroEn}+${capitulo}?translation=almeida`
    const res = await fetch(url, { next: { revalidate: 86400 } }) // cache 24h
    if (!res.ok) return null

    const data = await res.json()
    if (data.error || !data.verses) return null

    const versiculos: Versiculo[] = data.verses.map(
      (v: { verse: number; text: string }) => ({
        numero: v.verse,
        texto: v.text.trim(),
      })
    )

    return { numero: capitulo, versiculos }
  } catch {
    return null
  }
}
