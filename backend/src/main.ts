// main.ts — PUNTO DE ARRANQUE del backend.
// El nombre "main.ts" lo impone NestJS (por eso no se traduce).
import { existsSync } from 'node:fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Orígenes que pueden usar la API si no se indica otra cosa (el frontend en local con live-server)
const ORIGENES_LOCALES = ['http://127.0.0.1:5500', 'http://localhost:5500'];

// "async" porque crear la aplicación y ponerla a escuchar lleva un tiempo:
// "await" espera a que cada paso termine antes de seguir.
async function bootstrap() {
  // Configuración (fase 9): carga las variables del fichero .env en process.env.
  // process.loadEnvFile() viene incluido en Node.js, así que no hace falta ninguna librería extra.
  // - En local, las variables están en backend/.env.
  // - En Render (despliegue) NO hay fichero .env: las variables se configuran en su panel web
  //   y llegan ya cargadas en process.env. Por eso solo se lee el fichero si existe.
  if (existsSync('.env')) {
    process.loadEnvFile();   // lee ".env" de la carpeta desde la que se arranca (backend/)
  }

  if (!process.env.MONGODB_URI) {
    console.error('Falta la variable MONGODB_URI. En local: copia backend/.env.example como backend/.env.');
    process.exit(1);
  }

  // Crea la aplicación a partir del módulo raíz (AppModule)
  const app = await NestFactory.create(AppModule);

  // CORS (fase 7): el navegador bloquea las respuestas de un origen distinto al de la página
  // salvo que el servidor lo autorice. Autorizamos SOLO a nuestro frontend.
  // - En local: live-server (127.0.0.1:5500 o localhost:5500).
  // - En Render: la URL del sitio estático, indicada en la variable CORS_ORIGINS
  //   (varias direcciones separadas por comas).
  const origenes = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origen) => origen.trim())
    : ORIGENES_LOCALES;
  app.enableCors({ origin: origenes });

  // Validación (fase 6): todo lo que llega en @Body() se comprueba con las reglas de su DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // quita los campos que no están en el DTO...
      forbidNonWhitelisted: true,  // ...y además responde 400 si alguien los envía (p. ej. "hackeo")
      transform: true,             // convierte el JSON en un objeto del DTO (necesario para quitar espacios)
    }),
  );

  // Pone el servidor a escuchar en el puerto de la variable PORT (3000 si no se indica).
  // Render decide el puerto y lo pasa en PORT: por eso no puede ir fijo en el código.
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
