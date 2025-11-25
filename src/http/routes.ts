/* Damit wir eine Datei haben, in der alle vom Dienst verstandenen Pfade sichtbar sind.

In unserem Fall ist der Hauptpfad: POST /chat.


25.11.2025
* Wir „registrieren” den Pfad POST /chat (+)
* Überprüfungen (auth, rate-limit) (-)
* Validierung des Request-Bodys (-)
* Aufruf des "Gehirns" des Assistenten aus src/core (+)
* Rückgabe der Antwort im JSON-Format (+)

Wichtig: routes.ts darf nicht selbst überlegen, wie es antworten soll. Es verbindet lediglich den HTTP-Request mit der richtigen Funktion aus der Logik.*/


import { Router, Request, Response } from "express";
import {generateResp } from '../core/assistEngine';

const router = Router();

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
    try {
        const {message} = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required'});
            return;
        }

        console.log('(Router) Nachricht erhalten:', message);

        const aiReply = await generateResp(message);

        res.json({
            reply: aiReply,
            timestamp: new Date().toISOString
        });

    } catch (error) {
        console.error('Fehler', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

