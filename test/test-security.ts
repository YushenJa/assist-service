import { createApp } from '../src/http/server';
import http from 'http';

process.env.API_SECRET_KEY = 'test-secret-key-123';

const PORT = 9999;
const app = createApp();
const server = http.createServer(app);

server.listen(PORT, async () => {
    console.log(`Test-Server laeuft auf Port ${PORT}`);

    try {
        await runTests();
    } catch (err) {
        console.error("Fehler im Testablauf:", err);
    } finally {
        server.close();
        console.log("Server gestoppt. Test beendet.");
    }
});

async function runTests() {
    const url = `http://localhost:${PORT}/chat`;

    // --- TEST 1 ---
    console.log("Test 1: Anfrage ohne Schluessel");
    const res1 = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' })
    });
    
    if (res1.status === 403) {
        console.log("Erfolg: Status 403 (Verweigert)");
    } else {
        console.error(`Fehler: Status ${res1.status} statt 403`);
    }

    // --- TEST 2 ---
    console.log("Test 2: Anfrage mit falschem Schluessel");
    const res2 = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-api-key': 'falsches-passwort' 
        },
        body: JSON.stringify({ message: 'Hello' })
    });

    if (res2.status === 403) {
        console.log("Erfolg: Status 403 (Verweigert)");
    } else {
        console.error(`Fehler: Status ${res2.status} statt 403`);
    }

    // --- TEST 3 ---
    console.log("Test 3: Anfrage mit korrektem Schluessel");
    const res3 = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-api-key': 'test-secret-key-123'
        },
        body: JSON.stringify({ 
            message: 'Hello',
            sessionId: 'test-session'
        })
    });

    if (res3.status !== 403) {
        console.log(`Erfolg: Zugriff gewaehrt (Status ${res3.status})`);
    } else {
        console.error("Fehler: Zugriff trotz korrektem Schluessel verweigert");
    }
}