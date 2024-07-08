export abstract class Persona {
  id: string;
  nombre: string;
  apellido: string;
  dni: number;
  edad: number;
  fotoUrl: string[];
  correo: string;
  tipoUsuario: tipoUsuario;

  // constructor(id: string, rol: RolUsuario, nombre: string, apellido: string, dni: number, fotoUrl: string, correo: string) {

    constructor(id: string, nombre: string, apellido: string, dni: number, edad: number, fotoUrl: string[], correo: string, tipoUsuario: tipoUsuario) {
    this.id = id;
    // this.rol = rol;
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.edad = edad;
    this.fotoUrl = fotoUrl;
    this.correo = correo;
    this.tipoUsuario = tipoUsuario;
  }
}
export type tipoUsuario = 'paciente' | 'especialista' | 'admin';