import { inject } from '@angular/core';
import { Persona } from './persona';
import { Colecciones, DatabaseService } from '../services/database.service';

export class Especialista extends Persona {
  especialidades: string[];
  autorizado: boolean;
  horarios: string[];
  turnos: {fecha: string, horario: string}[] = [];
  constructor(
    id: string,
    nombre: string,
    apellido: string,
    dni: number,
    edad: number,
    fotosUrl: string,
    correo: string,
    especialidades: string[]
  ) {
    super(id, nombre, apellido, dni, edad, [fotosUrl], correo, "especialista");
    this.especialidades = especialidades;
    this.autorizado = false;
    this.horarios = [];
  }
}
