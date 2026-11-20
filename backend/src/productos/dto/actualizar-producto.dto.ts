// actualizar-producto.dto.ts — Datos aceptados al EDITAR (PATCH) un producto.
// Mismas reglas que al crear, pero TODOS los campos son opcionales:
// con PATCH se envía solo lo que cambia (por ejemplo, solo el precio).
// (Se repiten las reglas a propósito, para que se vean claras; existe una utilidad
//  llamada PartialType que lo hace automáticamente, pero exige otra librería.)
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';
import { CATEGORIAS } from './crear-producto.dto.js';

const quitarEspacios = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class ActualizarProductoDto {
  @IsOptional()
  @Transform(quitarEspacios)
  @IsString({ message: 'El nombre debe ser un texto.' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres.' })
  nombre?: string;

  @IsOptional()
  @Transform(quitarEspacios)
  @IsString({ message: 'La marca debe ser un texto.' })
  @Length(2, 50, { message: 'La marca debe tener entre 2 y 50 caracteres.' })
  marca?: string;

  @IsOptional()
  @IsIn(CATEGORIAS, { message: `La categoría debe ser una de: ${CATEGORIAS.join(', ')}.` })
  categoria?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con 2 decimales como máximo.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  precio?: number;

  @IsOptional()
  @IsInt({ message: 'El stock debe ser un número entero.' })
  @Min(0, { message: 'El stock no puede ser negativo.' })
  stock?: number;

  @IsOptional()
  @Transform(quitarEspacios)
  @IsString({ message: 'La descripción debe ser un texto.' })
  @MaxLength(300, { message: 'La descripción no puede superar los 300 caracteres.' })
  descripcion?: string;
}
