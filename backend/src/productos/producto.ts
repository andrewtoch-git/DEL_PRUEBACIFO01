// producto.ts — Describe la FORMA de un producto (sus campos y tipos).
// Es una "interfaz" de TypeScript: no genera código, solo sirve para que TypeScript
// avise si usamos un campo que no existe o con un tipo equivocado.
export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
}
