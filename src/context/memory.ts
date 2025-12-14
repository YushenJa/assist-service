import { HistoryItem } from './types';

//speichern alle Chats. Key = SessionID, Value = Liste der Nachrichten
const sessions: Record<string, HistoryItem[]> = {};


export const memoryManager = {

    getHistory: (sessionID: string): HistoryItem[] => {
        if (!sessions[sessionID]) {
            sessions[sessionID] = []
        }

        return sessions[sessionID];
    },

    addMessage: (sessionId: string, role: 'user' | 'model', text: string) => {
        if (!sessions[sessionId]) {
            sessions[sessionId] = [];
        }
        sessions[sessionId].push({
            role: role,
            parts: [{ text: text }]
        });
    },

    clear: (sessionId: string) => {
        delete sessions[sessionId];
    }

};
