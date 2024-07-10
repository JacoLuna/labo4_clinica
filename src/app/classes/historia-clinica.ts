import { Turnos } from "./turnos";

export class HistoriaClinica {
    id: string;
    altura: number;
    peso: number;
    temperatura: number;
    presion: number;
    comentario: string;
    turno: Turnos;
    datosAdicionales: {clave: string, campo:string}[];

    constructor(altura: number ,peso: number ,temperatura: number ,presion: number ,comentario: string, turno: Turnos,
        datosAdicionales: {clave: string, campo:string}[] = []){
        this.id = '';
        this.altura = altura;
        this.peso = peso;
        this.temperatura = temperatura;
        this.presion = presion;
        this.comentario = comentario;
        this.turno = turno;
        this.datosAdicionales = datosAdicionales;
    }
}
