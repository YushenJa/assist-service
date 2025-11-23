import { generateResp } from '../src/core/assistEngine';

async function test() {
    try {
        const answer = await generateResp ("Hi, wer bist du?");

        console.log('Antwort:');
        console.log(answer);
    } catch (err) {
        console.error('Fehler:', err);
    }
    
}

test();