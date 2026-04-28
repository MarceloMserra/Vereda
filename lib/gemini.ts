const OLLAMA_URL = process.env.OLLAMA_URL || 'https://ollama.cpisf.com.br'
const OLLAMA_MODEL = 'llama3.1:8b'

async function ollamaGenerate(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
  })
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
  const data = await res.json()
  return data.response as string
}

export type ReflexaoIA = {
  contexto: string
  reflexao: string
  pergunta: string
  versiculo: string
}

export async function gerarReflexao(
  livro: string,
  capitulos: string,
  testamento: string
): Promise<ReflexaoIA> {
  const prompt = `Você é um pastor batista evangelical brasileiro, com profundo conhecimento bíblico e coração pastoral.

Gere um material devocional BREVE para a leitura de hoje: ${livro} ${capitulos} (${testamento === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}).

Responda APENAS em JSON válido, sem markdown, sem blocos de código, exatamente neste formato:
{
  "contexto": "2-3 frases descrevendo o que acontece historicamente nessa passagem e por que ela importa na grande narrativa bíblica",
  "reflexao": "2-3 frases conectando o texto com a vida real de hoje, de forma prática e genuína",
  "pergunta": "Uma pergunta pessoal e profunda para meditação, que conecte o texto com a vida do leitor",
  "versiculo": "Um versículo marcante dessa passagem, com a referência (ex: João 3:16)"
}`

  const text = (await ollamaGenerate(prompt)).trim()
  const json = text.startsWith('{') ? text : text.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(json) as ReflexaoIA
}

export async function perguntarSobreTexto(
  pergunta: string,
  livro: string,
  capitulos: string
): Promise<string> {
  const prompt = `Você é um pastor batista evangelical brasileiro, com profundo conhecimento bíblico.

O leitor está lendo ${livro} ${capitulos} e fez esta pergunta:
"${pergunta}"

Responda de forma clara, breve (máximo 4 parágrafos) e pastoral, em português brasileiro. Conecte a resposta com a fé cristã evangélica.`

  return ollamaGenerate(prompt)
}
