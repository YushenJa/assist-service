/*

Inhalt:

Liste aller FAQ-Einträge und Szenarien:

* Frage/Vorlage/Schlüsselwörter;

* Kurzantwort;

* Direktlink (z. B. /accounts/{accountId}/files?status=ocr_failed);

* Mögliche Schnellaktion.

Im Wesentlichen handelt es sich um eine manuelle Wissensdatenbank.

*/

export interface FAQAction {
    type: 'link' | 'api';
    payload: string;
    label: string;

}

export interface FAQItem {
    id: string;
    keywords: string[];
    answer: string;
    action?: FAQAction;
}

export const faqDataBase: FAQItem[] = [
    // 1. Beleg hochladen
    {
        id:"upload_receipt",
        keywords: ['hochladen', 'beleg', 'upload', 'rechnung', 'foto', 'drag', 'drop', 'pdf', 'jpg', 'png'],
        answer: "Öffnen Sie den Upload-Bereich (oder 'Transaktionen'). Ziehen Sie PDF/JPG/PNG per Drag & Drop hinein oder wählen Sie sie über das Dialogfeld aus. Nach dem Hochladen wird die Texterkennung (OCR) automatisch gestartet.",
        /*action: {
            type: 'link',
            payload: '/upload',
            label: 'Zum Upload'
        }*/
    },

    // 2. OCR Fehler
    {
        id:"ocr_error",
        keywords: ['ocr', 'fehler', 'nicht erkannt', 'text fehlt', 'falsch erkannt', 'unscharf'],
        answer: "Wenn der Text nicht erkannt wurde: Versuchen Sie, die OCR zu wiederholen oder machen Sie ein schärferes Foto (ohne Reflexionen und keine schrägen Scans). Ein idealer Scan ist flach und gut beleuchtet."
    },

    // 3. Zeitraum filtern
    {
        id:"filter_time",
        keywords: ['zeitraum', 'datum', 'wann', 'filter', 'anzeigen', 'von bis'],
        answer: "Um nur Transaktionen aus einem bestimmten Zeitraum zu sehen, nutzen Sie den Datumsfilter (von/bis) oben auf der Seite 'Transaktionen'."
    },

    // 4. Duplikate
    {
        id:"duplicates",
        keywords: ['duplikat', 'doppelt', 'kopie', 'markiert'],
        answer: "Wenn eine Datei als Duplikat markiert ist, wurde entweder ein exaktes Datei-Duplikat oder ein nahezu identisches Beleg-Foto/Transaktion in der Datenbank gefunden."
    },

    // 5. Manuelle Erfassung
    {
        id:"manual_entry",
        keywords: ['manuell', 'ohne datei', 'per hand', 'eintippen', 'neu', 'erfassen'],
        answer: "Um eine Transaktion ohne Datei zu erfassen: Klicken Sie in 'Transaktionen' auf 'Neu' und füllen Sie Datum, Betrag, Währung und Händler manuell aus.",
        /*action: {
            type: 'link',
            payload: '/accounts/{accountId}/transactions?create=1',
            label: 'Transaktion erstellen'
        }*/
    },

    // 6. Händler/Kategorie Filter
    {
        id:"dealer/category_filter",
        keywords: ['händler', 'kategorie', 'filtern', 'suchen', 'sortieren'],
        answer: "Sie können die Filter 'Händler' oder 'Kategorie' oben in der Transaktionsliste verwenden, um spezifische Ausgaben zu finden."
    },

    // 7. Auswertungen / Report
    {
        id:"evaluations/report",
        keywords: ['auswertung', 'trend', 'diagramm', 'chart', 'statistik', 'report', 'analyse'],
        answer: "Auswertungen finden Sie im Bereich 'Report'. Dort gibt es Diagramme nach Zeitraum und Kategorie, um Ihre Trends zu analysieren."
    },

    // 8. Export
    {
        id:"export_data",
        keywords: ['export', 'csv', 'pdf', 'download', 'herunterladen', 'speichern'],
        answer: "Öffnen Sie den Bereich 'Export', wählen Sie das Format (CSV/PDF) und den Zeitraum.",
        /*action: {
            type: 'api',
            payload: 'OST /export/csv',
            label: 'Export starten'
        }*/
    },

    // 9. Karte / Map
    {
        id:"map",
        keywords: ['karte', 'map', 'ort', 'wo', 'location', 'standort'],
        answer: "Ihre Einkäufe können Sie geografisch im Bereich 'Karte' (Map) ansehen."
    },

    // 10. Person einladen
    {
        id:"invite_member",
        keywords: ['einladen', 'person', 'freund', 'mitglied', 'teilen', 'gemeinsam'],
        answer: "Gehen Sie zu 'Mitglieder'. Geben Sie dort E-Mail und Rolle an. Es wird ein Einmal-Link per E-Mail versendet.",
        /*action: {
            type: 'link',
            payload: '/accounts/{accountId}/members?tab=invite',
            label: 'Mitglied einladen'
        }*/
    },

    // 11. Einladung Probleme
    {
        id:"",
        keywords: ['einladung geht nicht', 'link abgelaufen', 'funktioniert nicht', 'keine mail'],
        answer: "Wenn die Einladung nicht funktioniert: Möglicherweise ist der Link abgelaufen (TTL) oder die E-Mail ist noch nicht verifiziert. Bitte senden Sie die Einladung erneut."
    },

    // 12. Rolle ändern
    {
        id:"invitation_problems",
        keywords: ['rolle', 'rechte', 'admin', 'editor', 'viewer', 'ändern', 'zugriff'],
        answer: "Um eine Rolle zu ändern (z.B. Viewer zu Editor): Wählen Sie in 'Mitglieder' die Person aus und aktualisieren Sie die Rolle. Das können nur Admins oder Owner. ",
        /*action: {
            type: 'link',
            payload: '/accounts/{accountId}/members?userId={userId}',
            label: 'Rolle ändern'
        }*/
    },

    // 13. Benachrichtigungen
    {
        id:"notifications",
        keywords: ['benachrichtigung', 'mail', 'email', 'notifikation', 'einstellen', 'aktivieren'],
        answer: "E-Mail-Benachrichtigungen können Sie in den 'Einstellungen' unter 'Notifications' für gewünschte Events einschalten." ,
        /*action: {
            type: 'link',
            payload: '/accounts/{accountId}/members?userId={userId}',
            label: 'Rolle ändern'
        }*/
    },

    // 14. Location zuordnen
    {
        id:"location_assign",
        keywords: ['adresse', 'falscher ort', 'zuordnen', 'location ändern'],
        answer: "Um einer Transaktion den richtigen Ort zuzuordnen: Öffnen Sie die Transaktion, klicken Sie auf 'Bearbeiten' und wählen Sie die Adresse/den Ort aus."
    },

    // 15. OCR Korrektur
    {
        id:"ocr_correction",
        keywords: ['betrag falsch', 'datum falsch', 'korrigieren', 'ändern', 'falsch erkannt'],
        answer: "Falls die OCR Betrag oder Datum falsch erkannt hat: Öffnen Sie die Transaktion, korrigieren Sie die Felder manuell und speichern Sie ab." 
    }
];