// productos.service.ts — SERVICIO: la lógica de los productos.
// Fase 9: los datos se guardan en MONGODB a través de Mongoose.
// → Sobreviven a recargar la página, a reiniciar el servidor y a apagar el ordenador.
//
// Comparado con la fase 5 (array en memoria), los métodos hacen lo mismo, pero:
// - son "async": hablar con la base de datos lleva tiempo (va por la red, aunque sea local);
// - el id es el _id de MongoDB (un texto como "6b0036..."), no un número.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Producto } from './producto.schema.js';
import type { CrearProductoDto } from './dto/crear-producto.dto.js';
import type { ActualizarProductoDto } from './dto/actualizar-producto.dto.js';

@Injectable()
export class ProductosService {
  // El "modelo" es el objeto de Mongoose para leer y escribir en la colección "productos".
  // NestJS lo inyecta gracias a @InjectModel.
  constructor(@InjectModel(Producto.name) private readonly modelo: Model<Producto>) {}

  async listar() {
    return this.modelo.find();   // todos los documentos de la colección
  }

  async obtenerUno(id: string) {
    // Un id con formato imposible no puede existir: respondemos 404 igual que si no estuviera
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`No existe ningún producto con id ${id}`);
    }
    const producto = await this.modelo.findById(id);
    if (!producto) {
      throw new NotFoundException(`No existe ningún producto con id ${id}`);
    }
    return producto;
  }

  // Los datos ya llegan VALIDADOS por el DTO. El _id lo pone MongoDB.
  async crear(datos: CrearProductoDto) {
    return this.modelo.create(datos);
  }

  async actualizar(id: string, datos: ActualizarProductoDto) {
    await this.obtenerUno(id);   // si no existe, lanza el 404

    // Solo los campos que traen valor (los no enviados existen como undefined: ver D32, fase 6)
    const cambios: Record<string, unknown> = {};
    for (const [campo, valor] of Object.entries(datos)) {
      if (valor !== undefined) {
        cambios[campo] = valor;
      }
    }

    // returnDocument: 'after' → devuelve el documento YA modificado
    return this.modelo.findByIdAndUpdate(id, cambios, { returnDocument: 'after' });
  }

  async eliminar(id: string) {
    await this.obtenerUno(id);   // si no existe, lanza el 404
    await this.modelo.findByIdAndDelete(id);
  }
}
