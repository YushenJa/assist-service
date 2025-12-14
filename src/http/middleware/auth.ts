/*

 * API Key Authentication Middleware

 *  Was macht dieses Modul:
    1. Es fängt eingehende Anfragen ab
    2. Es überprüft, ob der Header „x-api-key” vorhanden ist
    3. Es vergleicht den empfangenen Schlüssel mit dem geheimen Schlüssel des Servers (aus .env)

 *  Wozu ist das gut:
    - Schutz vor unbefugter Nutzung
    - Verhinderung von DDoS-Angriffen und Ausschöpfung der Google Cloud-Quote
    - Gewährleistung der Sicherheit auf Anwendungsebene (Application Layer Security)
 */

import { Request, Response, NextFunction } from 'express'


export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const API_SECRET = process.env.API_SECRET_KEY;
        
        const userKey = req.header('x-api-key');

        if (!API_SECRET) {
            console.warn("⚠️ WARNING: No API_SECRET_KEY! Security is OFF.");
            return next();
        }

        // Schlüsselprüfung
        if (userKey === API_SECRET) {
            return next();
        }

        console.warn(`⛔ Blocked unauthorized access from IP: ${req.socket.remoteAddress}`);

        return res.status(403).json({
            error: 'Access Denied: Invalid API Key'
        });

    };