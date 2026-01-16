/* 

Dies ist der „Einstiegspunkt“ des HTTP-Teils. Hier:

25.11.2025

* erstellen wir eine HTTP-Anwendung (über Express) (+)

* verbinden wir Routen (aus routes.ts) (+)

* verbinden wir Middleware (Protokollierung, Fehlerbehandlung usw.) (-)

* starten wir den Server auf dem Port (normalerweise nehmen Sie den Port aus process.env.PORT – Cloud Run legt ihn fest). (+)

*/

import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();


export function createApp(): Application {
    const app = express();

    const corsOptions = {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
    };

    app.use((req, res, next) => {
        console.log(`[Request]: ${req.method} ${req.originalUrl}`);
        next();
    });

    //Cross-Origin Resource Sharing (Entscheidet, wen man reinlässt. Momentan lassen alle rein)
    app.use(cors(corsOptions));
    //nur json-Format Anfragen
    app.use(express.json())


    app.use(routes);

    return app

}


if (require.main === module) {
    const app = createApp();
    const PORT = process.env.PORT ? Number(process.env.PORT) : 8080

    // warten auf Anfragen 
    app.listen(PORT, () => {
        console.log(`✅ Server läuft auf http://localhost:${PORT}`);
    });
}
