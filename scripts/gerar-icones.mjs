/**
 * Gera ícones SVG→PNG para o PWA.
 * Requer: npm install -D sharp
 * Uso: node scripts/gerar-icones.mjs
 */
import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const iconsDir = join(__dirname, '..', 'public', 'icons')

mkdirSync(iconsDir, { recursive: true })

function gerarIcone(tamanho) {
  const canvas = createCanvas(tamanho, tamanho)
  const ctx = canvas.getContext('2d')

  // Fundo
  ctx.fillStyle = '#0d1117'
  ctx.roundRect(0, 0, tamanho, tamanho, tamanho * 0.2)
  ctx.fill()

  // Texto central (V estilizado)
  ctx.fillStyle = '#f59e0b'
  ctx.font = `bold ${tamanho * 0.55}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('V', tamanho / 2, tamanho / 2)

  return canvas.toBuffer('image/png')
}

for (const size of [192, 512]) {
  const buf = gerarIcone(size)
  writeFileSync(join(iconsDir, `icon-${size}.png`), buf)
  console.log(`✓ icon-${size}.png`)
}
