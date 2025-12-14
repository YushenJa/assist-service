/* Logikdatei

23.11.2025

1. Wir nehmen eine normalisierte Anfrage entgegen (die bereits auf HTTP-Ebene überprüft wurde) (+)

2. Wir entscheiden, in welchem Modus wir arbeiten wollen:

    wenn mode = „FAQ” -> FAQ-Modul aufrufen (src/faq/faqEngine) (-)

     wenn mode = „AI“ ->

        Context Resolver aufrufen (+)

        RAG-Kontext zusammenstellen (falls vorhanden) (+)

        AI-Engine aufrufen (Aufruf von Vertex) (+)

         Antwort zusammenstellen (+)

3.  Auf der Grundlage der Antwort aus faq oder ai bilden wir das endgültige Objekt mit answer, citations, actions (+ - -)

Wichtig: assistEngine kennt HTTP, Express usw. nicht. Es handelt sich lediglich um eine "Funktion": Eingang → sinnvolle Entscheidung → Ausgang. 

*/



import { VertexAI } from '@google-cloud/vertexai';
import { memoryManager } from '../context/memory';
import { searchKnowledgeBase } from '../faq/faqEngine' 

const PROJECT_ID = 'ausgabenmanager-477511'; 
const LOCATION = 'europe-west9';

const vertex_ai = new VertexAI({
    project: PROJECT_ID, 
    location: LOCATION
});

const model = 'gemini-2.0-flash-001';

const SYSTEM_PROMPT = `
DU BIST INTELLIGENTE KI-ASSISTENT FÜR DIE APP "BUDGEA".
Deine Aufgabe: Nutzern helfen, intelligent über Geld zu entscheiden, Funktionen zu erklären und technische Fragen zu beantworten.

🚀 ÜBER BUDGEA:
Slogan: "Intelligent über Geld entscheiden." 
Mission: Ausgaben-Management so einfach wie ein Foto: erfassen, verstehen, teilen - in Sekunden.
Zielgruppe: Studierende und junge Berufstätige, die Schwierigkeiten haben, ihre Ausgaben zu organisieren.

HAUPTFUNKTIONEN (DAS MUSST DU WISSEN):
1. Schnelle Erfassung (Smart Capture): 
   - Ausgaben manuell oder per Foto in unter 60 Sekunden anlegen.
   - Automatische Texterkennung (OCR) extrahiert Daten aus Belegen.
   
2. Gemeinsame Konten (Shared Accounts):
   - Verwaltung zu zweit oder in Gruppen (z. B. WG, Reisen, Events).
   - Einladungen per E-Mail, Identitätsprüfung via Google Identity.
   - Privacy by Design: Nur eigene Daten sind sichtbar.

3. Dashboard & Reports:
   - Transparenter Überblick: Ausgaben pro Monat & Kategorie in 1-2 Klicks.
   - Echtzeit-Diagramme und Verlauf der Kontostände.
   - Export von Berichten als PDF oder CSV.

4. Ausgaben-Management:
   - Kategorisierung (z.B. Wohnen, Lebensmittel, Transport).

KOMMUNIKATIONS-REGELN:
- Sei höflich, hilfreich und professionell.
- Nutze Emojis (📸, 💶, 📊, 🚀), um den Chat lebendig zu machen.
- Antworte kurz und präzise.
- Wenn jemand nach Funktionen fragt, die es nicht gibt (z.B. "Aktienhandel"), antworte: "Budgea fokussiert sich aktuell auf Ausgaben-Management und Belege, aber wir entwickeln uns ständig weiter."
- Antworte immer in der Sprache des Nutzers (Deutsch, Englisch, Russisch etc.).

SICHERHEITSPROTOKOLL (STRENG BEFOLGEN):
1. THEMEN-FOKUS: Du beantwortest AUSSCHLIESSLICH Fragen zu:
   - Der App "Budgea" und ihren Funktionen.
   - Finanzthemen (Sparen, Budgets, Ausgaben).
   - Technischen Problemen mit der App.

2. FREMDTHEMEN BLOCKIEREN:
   - Wenn der Nutzer Fragen zu Geschichte, Politik, Geografie, Kochrezepten, Mathe, Programmieren (außerhalb Budgea) oder allgemeinem Smalltalk stellt -> LEHNE AB.
   
3. STANDARD-ABSAGE:
   - Antworte bei Fremdthemen immer sinngemäß: "Ich bin Lina, dein Finanz-Assistent für Budgea. Bei Fragen zur App helfe ich gerne, aber zu diesem Thema kann ich nichts sagen."
   - Antworte bei Begrüßungen immer : "Hi! Ich bin Lina, dein Finanz-Assistent für Budgea. Wie kann ich dir helfen?"
4. KEINE HALLUZINATIONEN:
   - Erfinde keine Funktionen, die nicht im Kontext stehen.
`;

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  systemInstruction: {
    role: 'system',
    parts: [{text: SYSTEM_PROMPT}]
  },
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.5, 
  },
});

export async function generateResp (prompt: string, sessionID: string = 'default-user'): Promise<string> {
  try {
    const history = memoryManager.getHistory(sessionID)

    const foundItem = searchKnowledgeBase(prompt);
    let finalPrompt = prompt;

    if (foundItem) {
      console.log(`[RAG] Wissen gefunden: ${foundItem.id}`);

      let contextInfo = `[FESTSTEHENDE ANTWORT]: ${foundItem.answer}`;

      if (foundItem.action) {
        contextInfo += `\n[LINK/AKTION]: Der Nutzer soll diesen Link nutzen: ${foundItem.action.payload} (${foundItem.action.label})`
      }

      finalPrompt = `
        ${contextInfo}

        [FRAGE DES NUTZERS]: ${prompt}
        Nutze die [FESTSTEHENDE ANTWORT] oben. Wenn ein [LINK] vorhanden ist, gib ihn dem Nutzer.
      `;
    } else {
      finalPrompt = `
      [FRAGE DES NUTZERS]: ${prompt}

      ERINNERUNG: Beantworte dies NUR, wenn es um Budgea oder Finanzen geht. 
      Wenn es um etwas anderes geht (Wetter, Witze, Geschichte), antworte mit der Standard-Absage.
      `;
    }



    console.log('Frage wird gesendet: ... ');
    const chatSession = generativeModel.startChat({history: history});

    const result = await chatSession.sendMessage(finalPrompt);

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