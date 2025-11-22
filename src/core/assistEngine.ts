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

const vertex_ai = new VertexAI({project: 'ТВОЙ_PROJECT_ID', location: 'us-central1'});
const model = 'gemini-1.5-flash-001';

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.5, 
  },
});