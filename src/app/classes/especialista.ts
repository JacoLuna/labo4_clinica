import { Persona } from './persona';

export class Especialista extends Persona {
  especialidad: string;
  autorizado: boolean;
  // constructor(id: string, rol: RolUsuario, nombre: string, apellido: string, dni: number, fotoUrl: string, correo: string) {
  constructor(
    id: string,
    nombre: string,
    apellido: string,
    dni: number,
    edad: number,
    fotosUrl: string,
    correo: string,
    especialidad: string
  ) {
    super(id, nombre, apellido, dni, edad, [fotosUrl], correo, "especialista");
    this.especialidad = especialidad;
    this.autorizado = false;
  }
}
