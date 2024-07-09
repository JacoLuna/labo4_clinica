import { Especialidad } from "./especialidad";
import { Especialista } from "./personas/especialista";

export class Turnos {
    id: string;
    idMedico: string;
    idPaciente: string;
    paciente: string;
    especialista: string;
    especialidad: string;
    fecha: string;
    horario: string;
    estado: estado;
    comentarioEspecialista: string = '';
    comentarioPaciente: string = '';

    constructor( idMedico: string, idPaciente: string, especialista: string, paciente: string, especialidad : string, horario: string, fecha: string){
        this.id = '';
        this.idMedico = idMedico;
        this.idPaciente = idPaciente;
        this.especialista = especialista;
        this.paciente = paciente;
        this.especialidad = especialidad;
        this.horario = horario;
        this.fecha = fecha;
        this.estado = 'pendiente'
    }
}

export type estado = 'pendiente' | 'aceptado'| 'rechazado' | 'cancelado' | 'finalizado';
