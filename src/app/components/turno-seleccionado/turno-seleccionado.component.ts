import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { estado, Turnos } from '../../classes/turnos';
import { Persona } from '../../classes/personas/persona';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { DatabaseService, Colecciones } from '../../services/database.service';
import { HistoriaClinica } from '../../classes/historia-clinica';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-turno-seleccionado',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './turno-seleccionado.component.html',
  styleUrl: './turno-seleccionado.component.scss'
})
export class TurnoSeleccionadoComponent {

  _turno: Turnos | undefined;
  @Input() set turno(value: Turnos) {
    this._turno = value;
    this.accionesEstado['aceptado'] = false;
    this.accionesEstado['rechazado'] = false;
    this.accionesEstado['cancelado'] = false;
    this.accionesEstado['finalizado'] = false;
  }
  @Input() usuario!: Persona;
  @Output() onTurnoActualizado = new EventEmitter<boolean>();
  cargando:boolean=false;
  comentario: string = '';
  accionesEstado : {[key:string]:boolean} = {  
    ['aceptado']:false,
    ['rechazado']:false,
    ['cancelado']:false,
    ['finalizado']:false
  };

  frmEncuesta: FormGroup;
  frmHistoriaClinica: FormGroup;
  datosDinamicos: {frm: FormGroup | undefined ,disponible: boolean}[] = []

  public set accion(accion: estado){
    this.accionesEstado['aceptado'] = false;
    this.accionesEstado['rechazado'] = false;
    this.accionesEstado['cancelado'] = false;
    this.accionesEstado['finalizado'] = false;
    this.accionesEstado[accion] = true;

    if(accion == 'aceptado'){
      this.actualizarTurno('aceptado');
    }
  }
  constructor(protected auth: AuthService, protected db: DatabaseService, protected frmBuilder: FormBuilder){
    this.frmEncuesta = this.frmBuilder.group({
      'satisfaccion':[''],
      'comentario':['', [Validators.minLength(20), Validators.maxLength(300)]]
    })
    this.frmHistoriaClinica = this.frmBuilder.group({
      'altura':['',[Validators.min(0)]],
      'peso':['',[Validators.min(0)]],
      'temperatura':['',[Validators.min(0)]],
      'presion':['',[Validators.min(0)]],
      'comentario':['', [Validators.minLength(20), Validators.maxLength(300)]]
    })
    this.datosDinamicos = [
      { frm: undefined, disponible: false},
      { frm: undefined, disponible: false},
      { frm: undefined, disponible: false},
    ]
  }

  async actualizarTurno(estado: estado, comentario?: string){
    this.cargando = true;
    if(this._turno){
      if(comentario){
        if(this.usuario.tipoUsuario == 'especialista')
          await this.db.actualizarDoc(Colecciones.Turnos, this._turno.id, {comentarioEspecialista: comentario});
        else{
          await this.db.actualizarDoc(Colecciones.Turnos, this._turno.id, {comentarioPaciente: comentario});
        }
      }
      await this.db.actualizarDoc(Colecciones.Turnos, this._turno.id, {estado: estado});
    }
    this.onTurnoActualizado.emit(true);
    this._turno = undefined;
    this.accionesEstado[this.accion] = false;
    this.cargando = false;
  }

  async subirHistoriaClinica(){
    this.cargando = true;
    let historiaCLinica: HistoriaClinica;
    let altura = this.frmHistoriaClinica.controls['altura'].value;
    let peso = this.frmHistoriaClinica.controls['peso'].value;
    let temperatura = this.frmHistoriaClinica.controls['temperatura'].value;
    let presion = this.frmHistoriaClinica.controls['presion'].value;
    let comentario = this.frmHistoriaClinica.controls['comentario'].value;
    let datosAdicionales : {clave: string, campo: string}[] = [];

    this.datosDinamicos.forEach( (datos, index) => {
      if(datos.disponible){
        this.frmHistoriaClinica.addControl(`datosDinamico${index}`, datos.frm);
        datosAdicionales.push({clave: datos.frm!.controls['clave'].value, campo: datos.frm!.controls['campo'].value});
      }
      else
        this.frmHistoriaClinica.removeControl(`datosDinamico${index}`);
    });
    this.actualizarTurno('finalizado',comentario);
    historiaCLinica = new HistoriaClinica(altura ,peso ,temperatura ,presion ,comentario, this._turno!, datosAdicionales);
    await this.db.subirDoc(Colecciones.HistoriaClinica, historiaCLinica);
    console.log(historiaCLinica);
    this.cargando = false;
  }

  addDato() {
    let datoDinamico = this.datosDinamicos.find( dato => !dato.disponible);
    if(datoDinamico){
      this.datosDinamicos[this.datosDinamicos.indexOf(datoDinamico)]['disponible'] = true;
      this.datosDinamicos[this.datosDinamicos.indexOf(datoDinamico)]['frm'] = 
          this.frmBuilder.group({
            'clave': ['', Validators.required],
            'campo': ['', Validators.required]
          })
    }
  }

  delDato(){
    let datoDinamico;
    for (let index = this.datosDinamicos.length - 1; index >= 0; index--) {
      if(this.datosDinamicos[index].disponible){
        this.datosDinamicos[index].disponible = false;
        datoDinamico = this.datosDinamicos[index];
        break;
      }
    }
    if(datoDinamico){
      this.datosDinamicos[this.datosDinamicos.indexOf(datoDinamico)]['disponible'] = false;
      this.datosDinamicos[this.datosDinamicos.indexOf(datoDinamico)]['frm'] = undefined;
    }
  }
}
