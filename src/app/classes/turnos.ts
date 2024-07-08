import { Especialidad } from "./especialidad";

export class Turnos {
    id: string;
    idPaciente: string;
    idMedico: string;
    especialidad: string;
    fecha: string;
    horario: string;

    constructor( idMedico: string, idPaciente: string,especialidad: string, horario: string, fecha: string){
        this.id = '';
        this.idMedico = idMedico;
        this.idPaciente = idPaciente;
        this.horario = horario;
        this.fecha = fecha;
        this.especialidad = especialidad;
    }
}
