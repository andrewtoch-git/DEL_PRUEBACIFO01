// main.ts — PUNTO DE ARRANQUE del backend.
// El nombre "main.ts" lo impone NestJS (por eso no se traduce).
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// "async" porque crear la aplicación y ponerla a escuchar lleva un tiempo:
// "await" espera a que cada paso termine antes de seguir.
async function bootstrap() {
  // Crea la aplicación a partir del módulo raíz (AppModule)
  const app = await NestFactory.create(AppModule);

  // Pone el servidor a escuchar peticiones HTTP en el puerto 3000
  await app.listen(3000);
}

await bootstrap();
