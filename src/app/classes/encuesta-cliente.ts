export class EncuestaCliente {
    id: string = '';
    turno: string;
    paciente: string;
    especialista: string;
    satisfaccion: string;
    comentario: string;

    constructor(turno: string ,paciente: string ,especialista: string ,satisfaccion: string ,comentario: string){
        this.turno = turno;
        this.paciente = paciente;
        this.especialista = especialista;
        this.satisfaccion = satisfaccion;
        this.comentario = comentario;
    }
}
