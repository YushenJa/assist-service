import { memoryManager } from '../src/context/memory';
import { generateResp } from '../src/core/assistEngine';

const USER_1 = "user-123";
const USER_2 = "user-999";
const TEST_ID = "test-session-" + Date.now();

function runTests() {

    const history1 = memoryManager.getHistory(USER_1);
    if (history1.length === 0) {
        console.log("Test 1: Neue Sitzung leer -> OK");
    } else {
        console.log("Test 1: Fehler, Sitzung ist nicht leer");
    }

    memoryManager.addMessage(USER_1, 'user', 'Hi!');
    memoryManager.addMessage(USER_1, 'model', 'Hi, Human!');



    const  history2 = memoryManager.getHistory(USER_1);
    if(history2.length === 2 && history2[0].role === 'user' && history2[0].parts[0].text === 'Hi!') {
        console.log("Test 2: Nachrichten werden gespeichert -> OK");
    } else {
        console.log("Test 2: Fehler beim Speichern");
    }

    const historyUser2 = memoryManager.getHistory(USER_2);
    if (historyUser2.length === 0) {
        console.log("Test 3: Verschiedene Benutzer stören sich nicht gegenseitig -> OK");
    } else {
        console.log("Test 3: Fehler, Sitzung ist nicht leer");
    }

    memoryManager.clear(USER_1);
    const historyClean = memoryManager.getHistory(USER_1);
    
    if (historyClean.length === 0) {
        console.log("Test 4: Speicherbereinigung funktioniert -> OK");
    } else {
        console.error("Test 4: Fehler! Der Speicher wurde nicht gelöscht");
    }

}


async function runDialogueTest() {

    try {
        const q1= "Hi, ich bin Yulia"
        console.log(q1);        
        const answer1 = await generateResp(q1, TEST_ID);
        console.log(`AI: ${answer1}`);

        const q2= "Wie heiße ich? Antworte mit einem Wort"
        console.log(q2);
        const answer2 = await generateResp(q2, TEST_ID);
        console.log(`AI: ${answer2}`);

        if (answer2.includes("Yulia")) {
            console.log("Die KI hat sich den Namen gemerkt -> OK");
        } else {
            console.log("KI hat den Namen vergessen.");
        }

    } catch (e) {
        console.error("Fehler:", e);
    }
}

runTests();
runDialogueTest();