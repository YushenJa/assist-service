/*

1. Ruft die normalisierte Frage ab (message + locale).

2. Findet den passendsten FAQ-Eintrag:

    anhand von Schlüsselwörtern/Tags,
    anhand einer einfachen Trefferquote*

3. Gibt eine Struktur im folgenden Format zurück:

    Antworttext;
    Liste der Quellen (IDs interner FAQ-Einträge);
    Vorgeschlagene Aktionen (Deep-Link und optional Schnellaktion).

Falls keine Übereinstimmung gefunden wird, wird eine einfache Fallback-Option angezeigt: „Ich habe nichts Passendes gefunden…“ + Liste beliebter Themen.

*/

import { faqDataBase, FAQItem } from "./faqData";

export function searchKnowledgeBase (userQuery: string):    FAQItem | null {
    const query = userQuery.toLowerCase();

    for (const item of faqDataBase) {
        const found = item.keywords.some(keyword => query.includes(keyword.toLowerCase()))
    
        if (found) {
            return item;
        }
    }

    return null;

}