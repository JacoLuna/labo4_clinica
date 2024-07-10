export class Especialidad {
  id : string;
  nombre: string;
  aprobada: boolean;
  fotoUrl: string;
  constructor(nombre: string, fotoUrl?: string) { 
    this.id = '';
    this.nombre = nombre; 
    this.aprobada = true; 
    this.fotoUrl = "https://firebasestorage.googleapis.com/v0/b/lab4lunajaco.appspot.com/o/imagenes%2Fespecialidades%2Fdefault.PNG?alt=media&token=cb98b867-1475-495e-9e4b-749ce1cf9793";
  }
}