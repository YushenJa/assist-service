/* 

Dies ist der „Einstiegspunkt“ des HTTP-Teils. Hier:

25.11.2025

* erstellen wir eine HTTP-Anwendung (über Express) (+)

* verbinden wir Routen (aus routes.ts) (+)

* verbinden wir Middleware (Protokollierung, Fehlerbehandlung usw.) (-)

* starten wir den Server auf dem Port (normalerweise nehmen Sie den Port aus process.env.PORT – Cloud Run legt ihn fest). (+)

*/

import express, { Application } from 'express'
import cors from 'cors';
import routes from './routes';


export function createApp(): Application {
    const app = express();

    //Cross-Origin Resource Sharing (Entscheidet, wen man reinlässt. Momentan lassen alle rein)
    app.use(cors());

    //nur json-Format Anfragen
    app.use(express.json())

    //"Rerouting" (bearbeitet Anfragen)
    app.use(routes);

    return app

}


if (require.main === module) {
    const app = createApp();
    const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

    // warten auf Anfragen 
    app.listen(PORT, () => {
        console.log(`✅ Server läuft auf http://localhost:${PORT}`);
    });
}
