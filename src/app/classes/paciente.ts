import { Persona } from './persona';

export class Paciente extends Persona {
  // constructor(id: string, rol: RolUsuario, nombre: string, apellido: string, dni: number, fotoUrl: string, correo: string) {
  constructor(
    id: string,
    nombre: string,
    apellido: string,
    dni: number,
    edad: number,
    fotoUrl: string[],
    correo: string
  ) {
    super(id, nombre, apellido, dni, edad, fotoUrl, correo, "paciente");
  }
}
