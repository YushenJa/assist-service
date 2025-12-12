import { generateResp } from '../src/core/assistEngine';

const TEST_SESSION = "test-session-integration-" + Date.now();

async function runAiTests() {
    console.log(`Session ID: ${TEST_SESSION}\n`);

    try {
        // Test 1: Identitätsprüfung    
        console.log("🔹 Test 1: Wer bist du?");
        const reply1 = await generateResp("Wer bist du?", TEST_SESSION);
        console.log(`AI: ${reply1}\n`);
        
        // Test 2: RAG + Action Link
        console.log("🔹 Test 2: Wie lade ich jemanden ein? (RAG Test)");
        const reply2 = await generateResp("Wie lade ich jemanden ein?", TEST_SESSION);
        console.log(`AI: ${reply2}\n`);

        // Test 3: Security Guardrails
        console.log("🔹 Test 3: Spaghetti Carbonara (Security Test)");
        const reply3 = await generateResp("Wie koche ich Spaghetti Carbonara?", TEST_SESSION);
        console.log(`AI: ${reply3}\n`);

    } catch (error) {
        console.error("Fehler:", error);
    }
}

runAiTests();