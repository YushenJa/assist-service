/*Это «точка входа» HTTP-части. Здесь ты:

создаёшь HTTP-приложение (через Express/Fastify — не важно, какой фреймворк);

подключаешь маршруты (из routes.ts);

подключаешь мидлвары (логирование, обработка ошибок и т. д.);

запускаешь сервер на порту (обычно порт берёшь из process.env.PORT — Cloud Run его задаст).*/

import express, { Application } from 'express'


export function createApp(): Application {
    const app = express()

    app.use(express.json())


    return app
    
}
