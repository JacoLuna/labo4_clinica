import { Turnos } from "./turnos";

export class EncuestaPaciente {
    id: string = '';
    turno: Turnos;
    paciente: string;
    especialista: string;
    satisfaccion: string;
    comentario: string;

    constructor(turno: Turnos ,paciente: string ,especialista: string ,satisfaccion: string ,comentario: string){
        this.turno = turno;
        this.paciente = paciente;
        this.especialista = especialista;
        this.satisfaccion = satisfaccion;
        this.comentario = comentario;
    }
}
