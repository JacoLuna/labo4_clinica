import { Especialidad } from "./especialidad";

export class Turnos {
    id: string;
    idMedico: string;
    especialidad: string;
    fecha: string;
    horario: string;

    constructor( idMedico: string, especialidad: string, horario: string, fecha: string){
        this.id = '';
        this.idMedico = idMedico;
        this.horario = horario;
        this.fecha = fecha;
        this.especialidad = especialidad;
    }
}
