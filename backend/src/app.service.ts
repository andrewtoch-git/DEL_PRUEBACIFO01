// app.service.ts — SERVICIO: contiene la lógica (el "trabajo de verdad").
import { Injectable } from '@nestjs/common';

@Injectable()   // permite que NestJS lo cree y lo entregue a quien lo necesite
export class AppService {
  getHello(): string {
    return '¡Hola desde el backend!';
  }
}
