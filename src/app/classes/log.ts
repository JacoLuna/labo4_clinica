export class Log {
    id: string;
    idUsuario: string;
    usuario: string;
    fecha: string;

    constructor(idUsuario: string,usuario: string,fecha: string){
        this.id = '';
        this.idUsuario = idUsuario;
        this.usuario = usuario;
        this.fecha = fecha;
    }
}
