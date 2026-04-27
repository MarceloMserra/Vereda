import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

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

  const result = await model.generateContent(prompt)
  return result.response.text()
}
