export class Especialidad {
  id : string;
  nombre: string;
  aprobada: boolean;
  constructor(id: string, nombre: string) {
    this.id = id; 
    this.nombre = nombre; 
    this.aprobada = false; 
  }
}