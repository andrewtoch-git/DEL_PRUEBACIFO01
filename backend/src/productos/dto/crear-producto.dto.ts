// crear-producto.dto.ts — DTO (Data Transfer Object, "objeto para transportar datos").
// Describe QUÉ datos se aceptan al CREAR un producto y con QUÉ REGLAS.
// Cada decorador de class-validator (@IsString, @Length...) es una regla.
// Si alguna no se cumple, NestJS responde 400 automáticamente y el servicio ni se entera.
//
// Las reglas son las de CLAUDE.md (apartado 5.1). Son las mismas que valida el frontend:
// el frontend valida para ayudar al usuario; el backend valida porque NO puede fiarse del cliente.
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';

// Lista cerrada de categorías permitidas
export const CATEGORIAS = ['portatil', 'smartphone', 'tablet', 'periferico', 'audio', 'accesorio'];

// Quita los espacios del principio y del final de los textos (como trim() en el frontend).
// Así, un nombre de solo espacios se queda vacío y no pasa la regla de longitud.
const quitarEspacios = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CrearProductoDto {
  @Transform(quitarEspacios)
  @IsString({ message: 'El nombre debe ser un texto.' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres.' })
  nombre: string;

  @Transform(quitarEspacios)
  @IsString({ message: 'La marca debe ser un texto.' })
  @Length(2, 50, { message: 'La marca debe tener entre 2 y 50 caracteres.' })
  marca: string;

  @IsIn(CATEGORIAS, { message: `La categoría debe ser una de: ${CATEGORIAS.join(', ')}.` })
  categoria: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con 2 decimales como máximo.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  precio: number;

  @IsInt({ message: 'El stock debe ser un número entero.' })
  @Min(0, { message: 'El stock no puede ser negativo.' })
  stock: number;

  // "?" = campo opcional. @IsOptional: si no viene, no se comprueba nada más.
  @IsOptional()
  @Transform(quitarEspacios)
  @IsString({ message: 'La descripción debe ser un texto.' })
  @MaxLength(300, { message: 'La descripción no puede superar los 300 caracteres.' })
  descripcion?: string;
}
