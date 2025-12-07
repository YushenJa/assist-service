/* Logikdatei

23.11.2025

1. Wir nehmen eine normalisierte Anfrage entgegen (die bereits auf HTTP-Ebene überprüft wurde) (+)

2. Wir entscheiden, in welchem Modus wir arbeiten wollen:

    wenn mode = „FAQ” -> FAQ-Modul aufrufen (src/faq/faqEngine) (-)

     wenn mode = „AI“ ->

        Context Resolver aufrufen (src/context/resolver) (-)

        RAG-Kontext zusammenstellen (falls vorhanden) (-)

        AI-Engine aufrufen (Aufruf von Vertex) (+)

         Antwort zusammenstellen (+)

3.  Auf der Grundlage der Antwort aus faq oder ai bilden wir das endgültige Objekt mit answer, citations, actions (+ - -)

Wichtig: assistEngine kennt HTTP, Express usw. nicht. Es handelt sich lediglich um eine "Funktion": Eingang → sinnvolle Entscheidung → Ausgang. 

*/



import { VertexAI } from '@google-cloud/vertexai';
import { memoryManager } from '../context/memory';
import { Session } from 'inspector';

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

export async function generateResp (prompt: string, sessionID: string = 'default-user'): Promise<string> {
  try {
    const history = memoryManager.getHistory(sessionID)
    console.log('Frage wird gesendet: ... ');
    const chatSession = generativeModel.startChat({history: history});

    const result = await chatSession.sendMessage(prompt);

    if (!result.response.candidates || result.response.candidates.length === 0) {
      throw new Error('leere Antwort');
    }

    const responseText = result.response.candidates[0].content.parts[0].text;

    if (!responseText) {
      throw new Error ("leere Antwort");
    }

    memoryManager.addMessage(sessionID, 'user', prompt)
    memoryManager.addMessage(sessionID, 'model', responseText);

    return responseText;

  } catch (error) {
    console.error ("Fehler ...");
    throw error;
  }
}