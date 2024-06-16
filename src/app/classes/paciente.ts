import { Persona } from './persona';

export class Paciente extends Persona {
  obraSocial: string;
  
  constructor(
    id: string,
    nombre: string,
    apellido: string,
    dni: number,
    edad: number,
    fotoUrl: string[],
    correo: string,
    obraSocial: string
  ) {
    super(id, nombre, apellido, dni, edad, fotoUrl, correo, "paciente");
    this.obraSocial = obraSocial;
  }
}
