// producto.schema.ts — ESQUEMA: la forma que tienen los productos dentro de MongoDB.
// Sustituye a la interfaz "producto.ts" de las fases 5–7.
// Mongoose usa este esquema para crear el "modelo": el objeto con el que se leen y guardan documentos.
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'productos',   // nombre de la colección en MongoDB
  versionKey: false,         // no guardar el campo interno "__v" de Mongoose
  // Fechas automáticas de creación y modificación (CLAUDE.md 5.1: "se valorará añadir fechas")
  timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
  // Al convertir un documento a JSON (para enviarlo al frontend):
  // - "virtuals: true" añade el campo "id" (el _id de MongoDB convertido en texto)
  // - "transform" quita el "_id" original.
  // Así el frontend sigue recibiendo "id" igual que en la fase 7 y NO necesita cambios.
  toJSON: {
    virtuals: true,
    transform: (_documento: unknown, resultado: Record<string, unknown>) => {
      delete resultado._id;
      return resultado;
    },
  },
})
export class Producto {
  // @Prop = "esto es un campo del documento". Las reglas detalladas ya las comprueba el DTO;
  // aquí solo se marca lo obligatorio, como última protección dentro de la propia base de datos.
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  marca: string;

  @Prop({ required: true })
  categoria: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ default: '' })   // si no se envía, se guarda como texto vacío
  descripcion: string;
}

// Construye el esquema de Mongoose a partir de la clase de arriba
export const ProductoSchema = SchemaFactory.createForClass(Producto);
