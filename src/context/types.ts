/* 

* Beschreibt, welche Fakten wir an die Assistenten-Engine übergeben:

    * Liste der Dateien mit zulässigen Feldern (ID, Datum, Status, Betrag, normalisierter Händler);

    * Liste der Transaktionen mit grundlegenden Attributen;

    * Beschränkungen hinsichtlich Anzahl/Größe.

* Chat & Speicher

*/

export interface HistoryItem {
    role: 'user' | 'model';
    parts: [{text: string}];
}

export interface ChatSession {
    history: HistoryItem[];
}