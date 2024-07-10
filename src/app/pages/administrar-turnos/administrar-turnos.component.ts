import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatActionList, MatList, MatListItem } from '@angular/material/list';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { Turnos } from '../../classes/turnos';
import { AuthService } from '../../services/auth.service';
import { Especialista } from '../../classes/personas/especialista';
import { Paciente } from '../../classes/personas/paciente';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Persona } from '../../classes/personas/persona';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Admin } from '../../classes/personas/admin';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { EncuestaCliente } from '../../classes/encuesta-cliente';
import { HistoriaClinica } from '../../classes/historia-clinica';
import { TurnoSeleccionadoComponent } from '../../components/turno-seleccionado/turno-seleccionado.component';
import { VerReseniaComponent } from '../../components/ver-resenia/ver-resenia.component';


@Component({
  selector: 'app-administrar-turnos',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, MatActionList, MatList, MatListItem, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatTableModule, MatIconModule, MatButtonModule, MatCardModule, MatTooltipModule, MatSliderModule, MatInputModule, TurnoSeleccionadoComponent, VerReseniaComponent],
  templateUrl: './administrar-turnos.component.html',
  styleUrl: './administrar-turnos.component.scss'
})
export class AdministrarTurnosComponent implements OnInit {
  cargando: boolean = true;
  persona!: Persona;
  turno: Turnos | undefined;
  encuesta: EncuestaCliente | undefined;
  comentario: string = '';
  turnos: Turnos[] = [];
  personas: Persona[] = [];
  pacientes: Paciente[] = [];
  especialistas: Especialista[] = [];
  encuestas: EncuestaCliente[] = [];
  frmFiltro = new FormControl('');
  filteredOptions!: Observable<Turnos[]>;

  // quiereCancelar:boolean = false;
  // quiereFinalizar:boolean = false;

  columnsTurnoPendientes: string[] = [ 'especialidad', 'fecha', 'horario', 'medico', 'paciente', 'estado']; 
  // columnsTurno: string[] = [ 'especialidad', 'fecha', 'horario', 'medico', 'paciente', 'estado', 'cancelar', 'reseña', 'encuesta', 'atencion'];

  frmEncuesta: FormGroup;
  frmHistoriaClinica: FormGroup;
  datosDinamicos: {frm: FormGroup | undefined ,disponible: boolean}[] = []
  constructor(protected auth: AuthService, protected db: DatabaseService, protected frmBuilder: FormBuilder){
    this.frmEncuesta = this.frmBuilder.group({
      'satisfaccion':[''],
      'comentario':['', [Validators.minLength(20), Validators.maxLength(300)]]
    })
    this.frmHistoriaClinica = this.frmBuilder.group({
      'altura':['',],
      'peso':['',],
      'temperatura':['',],
      'presion':['',],
      'comentario':['', [Validators.minLength(20), Validators.maxLength(300)]]
    })
    this.datosDinamicos = [
      { frm: undefined, disponible: false},
      { frm: undefined, disponible: false},
      { frm: undefined, disponible: false},
    ]
  }

  async ngOnInit(): Promise<void> {
    await this.cargarTurnos();
    this.cargando = false;
  }

  async cargarTurnos(){
    this.cargando = true;
    this.turnos = await this.db.traerColeccion<Turnos>(Colecciones.Turnos);
    this.encuestas = await this.db.traerColeccion<EncuestaCliente>(Colecciones.Encuestas);
    if(this.auth.UsuarioEnSesion?.tipoUsuario == 'especialista'){
      this.persona = <Especialista>this.auth.UsuarioEnSesion;
      this.turnos = this.turnos.filter( turno => turno.especialista == this.persona.nombre + " " + this.persona.apellido);
    }
    else if(this.auth.UsuarioEnSesion?.tipoUsuario == 'paciente'){
      this.persona = <Paciente>this.auth.UsuarioEnSesion;
      this.turnos = this.turnos.filter( turno => turno.paciente == this.persona.nombre + " " + this.persona.apellido);
    }
    else{
      this.persona = <Admin>this.auth.UsuarioEnSesion;
      this.turnos = this.turnos.filter( turno => turno.estado == 'pendiente');
    }

    this.filteredOptions = this.frmFiltro.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '' )),
    );
    
    this.cargando = false;;
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    
    switch(this.persona.tipoUsuario){
      case 'admin':
        return this.turnos.
        filter(option => 
          option.especialidad.toLowerCase().includes(filterValue) || option.especialista.toLowerCase().includes(filterValue));
      case 'paciente':
        return this.turnos.
        filter(option => 
          option.especialidad.toLowerCase().includes(filterValue) || option.especialista.toLowerCase().includes(filterValue));
      case 'especialista':
        return this.turnos.
        filter(option => 
          option.especialidad.toLowerCase().includes(filterValue) || option.paciente.toLowerCase().includes(filterValue));
    }

  }
  
  // async handleTurno(estado: string){

  //   switch(estado){
  //     case 'rechazado':
  //       break;
  //     case 'cancelado':
  //       this.quiereFinalizar = false;
  //       this.quiereCancelar = true;
  //       break;
  //     case 'finalizado':
  //       this.quiereCancelar = false;
  //       this.quiereFinalizar = true;
  //       break;
  //   }
  // }

  // async actualizarTurno(turno: Turnos, estado: string){
  //   this.turno = turno;
  //   if(estado){
  //     this.cargando = true;

  //     if(this.persona.tipoUsuario == 'especialista')
  //       await this.db.actualizarDoc(Colecciones.Turnos, turno.id, {estado: estado, comentarioEspecialista: this.comentario});
  //     else
  //       await this.db.actualizarDoc(Colecciones.Turnos, turno.id, {estado: estado, comentarioPaciente: this.comentario});
      
  //     await this.cargarTurnos();
  //     this.turno = undefined;
  //     this.cargando = false;
  //     // this.quiereCancelar = false;
  //     // this.quiereFinalizar = false;
  //   }
  // }

  async rowClicked(turno : Turnos){
    this.turno = turno;
    if(turno.estado == 'finalizado'){
      this.encuesta = this.encuestas.filter(encuesta => encuesta.turno = this.turno!)[0];
    }
  }

  // async subirEncuesta(){
  //   this.cargando = true;
  //   let encuesta =
  //   new EncuestaCliente(this.turno!.id, this.turno!.paciente, this.turno!.especialista, this.frmEncuesta.controls['satisfaccion'].value, this.frmEncuesta.controls['comentario'].value)
  //   await this.db.actualizarDoc(Colecciones.Turnos, this.turno!.id, {comentarioPaciente: this.frmEncuesta.controls['comentario'].value});
  //   await this.db.subirDoc(Colecciones.Encuestas, encuesta);
  //   this.turno = undefined;
  //   this.cargando = false;
  // }

  // async subirHistoriaClinica(){
  //   this.cargando = true;
    
  //   let historiaCLinica;
  //   let altura = this.frmHistoriaClinica.controls['altura'].value;
  //   let peso = this.frmHistoriaClinica.controls['peso'].value;
  //   let temperatura = this.frmHistoriaClinica.controls['temperatura'].value;
  //   let presion = this.frmHistoriaClinica.controls['presion'].value;
  //   let comentario = this.frmHistoriaClinica.controls['comentario'].value;
  //   let datosAdicionales : {clave: string, campo: string}[] = [];

  //   this.datosDinamicos.forEach( (datos, index) => {
  //     if(datos.disponible){
  //       this.frmHistoriaClinica.addControl(`datosDinamico${index}`, datos.frm);
  //       datosAdicionales.push({clave: datos.frm!.controls['clave'].value, campo: datos.frm!.controls['campo'].value});
  //     }
  //     else
  //       this.frmHistoriaClinica.removeControl(`datosDinamico${index}`);
  //   })
  //   historiaCLinica = new HistoriaClinica(altura ,peso ,temperatura ,presion ,comentario, this.turno!, datosAdicionales);
  //   await this.db.subirDoc(Colecciones.HistoriaClinica, historiaCLinica);
  //   this.cargando = false;
  // }

  // addDato() {
  //   let datoDinamico = this.datosDinamicos.find( dato => !dato.disponible);
  //   if(datoDinamico){
  //     this.datosDinamicos[this.datosDinamicos.indexOf(datoDinamico)]['disponible'] = true;
  //     this.datosDinamicos[this.datosDinamicos.indexOf(datoDinamico)]['frm'] = 
  //         this.frmBuilder.group({
  //           'clave': ['', Validators.required],
  //           'campo': ['', Validators.required]
  //         })
  //   }
  // }
  // delDato(){
  //   let datoDinamico;
  //   for (let index = this.datosDinamicos.length - 1; index >= 0; index--) {
  //     if(this.datosDinamicos[index].disponible){
  //       this.datosDinamicos[index].disponible = false;
  //       datoDinamico = this.datosDinamicos[index];
  //       break;
  //     }
  //   }
  //   if(datoDinamico){
  //     this.datosDinamicos[this.datosDinamicos.indexOf(datoDinamico)]['disponible'] = false;
  //     this.datosDinamicos[this.datosDinamicos.indexOf(datoDinamico)]['frm'] = undefined;
  //   }
  // }
}
