async function testServer() {
    console.log ("Sende HTTP-Anfrage an lokalen Server...")

    try {
        const response = await fetch('https://assist-service-251746638685.europe-west3.run.app/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: "Hallo! Erzähl mir einen Witz über eine Katze"})
        });

        const data = await response.json();
        console.log('Antwort: ', data);
    } catch (error) {
        console.error("Fehler: ", error);
    }
}

testServer();