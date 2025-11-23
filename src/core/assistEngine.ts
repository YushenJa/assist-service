/* Главный файл логики

1. Принимаем нормализованный запрос (уже проверенный на HTTP-уровне).

2. Решаем, в каком режиме работать:

    если mode = "FAQ" → вызвать FAQ-модуль (src/faq/faqEngine);

    если mode = "AI" →

        вызвать Context Resolver (src/context/resolver),

        собрать RAG-контекст (если будет),

        вызвать AI-движок (например, отдельный модуль с вызовом Vertex/Groq),

        собрать ответ.

3. На основе ответа из faq или ai формируем финальный объект с answer, citations, actions.

Важно: assistEngine не знает про HTTP, Express и т. п. Это просто «функция»: вход → разумное решение → выход. */



import { VertexAI } from '@google-cloud/vertexai';

const PROJECT_ID = 'ausgabenmanager-477511'; 
const LOCATION = 'europe-west9';

const vertex_ai = new VertexAI({
    project: PROJECT_ID, 
    location: LOCATION
});
const model = 'gemini-2.0-flash-001';

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.5, 
  },
});

export async function generateResp (prompt: string): Promise<string> {
  try {
    console.log('Frage wird gesendet: ... ');
    const chatSession = generativeModel.startChat({});
    const result = await chatSession.sendMessage(prompt);

    if (!result.response.candidates || result.response.candidates.length === 0) {
      throw new Error('leere Antwort');
    }

    const responseText = result.response.candidates[0].content.parts[0].text;

    if (!responseText) {
      throw new Error ("leere Antwort");
    }

    return responseText;

  } catch (error) {
    console.error ("Fehler ...");
    throw error;
  }
}