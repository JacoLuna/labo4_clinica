import { Persona } from "./persona";

export class Admin extends Persona {
  constructor(id: string, nombre: string, apellido: string, dni: number, edad: number, fotoUrl: string, correo: string) {
    super(id, nombre, apellido, dni, edad, [fotoUrl], correo, 'admin')
  }
}