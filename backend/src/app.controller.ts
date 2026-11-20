// app.controller.ts — CONTROLADOR: recibe las peticiones HTTP y devuelve la respuesta.
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()   // sin ruta: atiende la raíz "/"
export class AppController {
  // NestJS crea el servicio y lo "inyecta" aquí automáticamente (inyección de dependencias)
  constructor(private readonly appService: AppService) {}

  @Get()   // responde a las peticiones GET a "/"
  getHello(): string {
    // El controlador no hace el trabajo: se lo pide al servicio
    return this.appService.getHello();
  }
}
