import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatActionList, MatList, MatListItem } from '@angular/material/list';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { Turnos } from '../../classes/turnos';
import { AuthService } from '../../services/auth.service';
import { Especialista } from '../../classes/personas/especialista';
import { Paciente } from '../../classes/personas/paciente';
import { delay, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Especialidad } from '../../classes/especialidad';
import { ObraSocial } from '../../classes/obraSocial';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Persona } from '../../classes/personas/persona';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Admin } from '../../classes/personas/admin';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';


@Component({
  selector: 'app-administrar-turnos',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, MatActionList, MatList, MatListItem, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatTableModule, MatIconModule, MatButtonModule, MatCardModule, MatTooltipModule, MatSliderModule],
  templateUrl: './administrar-turnos.component.html',
  styleUrl: './administrar-turnos.component.scss'
})
export class AdministrarTurnosComponent implements OnInit {
  cargando: boolean = true;
  persona!: Persona;
  turno: Turnos | undefined;
  comentario: string = '';
  turnos: Turnos[] = [];
  personas: Persona[] = [];
  pacientes: Paciente[] = [];
  especialistas: Especialista[] = [];
  
  frmFiltro = new FormControl('');
  filteredOptions!: Observable<Turnos[]>;

  quiereCancelar:boolean = false;
  quiereFinalizar:boolean = false;
  
  columnsTurnoPendientes: string[] = [ 'especialidad', 'fecha', 'horario', 'medico', 'paciente', 'estado']; 
  columnsTurno: string[] = [ 'especialidad', 'fecha', 'horario', 'medico', 'paciente', 'estado', 'cancelar', 'reseña', 'encuesta', 'atencion'];

  frmEncuesta: FormGroup;
  constructor(protected auth: AuthService, protected db: DatabaseService, protected frmBuilder: FormBuilder){
    this.frmEncuesta = this.frmBuilder.group({
      'turno':[''],
      'paciente':[''],
      'especialista':[''],
      'satisfaccion':[''],
      'comentario':['']
    })
  }

  async ngOnInit(): Promise<void> {
    await this.cargarTurnos();
    this.cargando = false;
  }

  async cargarTurnos(){
    this.turnos = await this.db.traerColeccion<Turnos>(Colecciones.Turnos);
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
  
  async handleTurno(estado: string){

    switch(estado){
      case 'rechazado':
        break;
      case 'cancelado':
        this.quiereFinalizar = false;
        this.quiereCancelar = true;
        break;
      case 'finalizado':
        this.quiereCancelar = false;
        this.quiereFinalizar = true;
        break;
    }
  }

  async actualizarTurno(turno: Turnos, estado: string){
    this.turno = turno;
    if(estado){
      this.cargando = true;

      if(this.persona.tipoUsuario == 'especialista')
        await this.db.actualizarDoc(Colecciones.Turnos, turno.id, {estado: estado, comentarioEspecialista: this.comentario});
      else
        await this.db.actualizarDoc(Colecciones.Turnos, turno.id, {estado: estado, comentarioPaciente: this.comentario});
      
      await this.cargarTurnos();
      this.turno = undefined;
      this.cargando = false;
      this.quiereCancelar = false;
      this.quiereFinalizar = false;
    }
  }
  

  verComentario(){

  }

  rowClicked(turno : Turnos){
    this.turno = turno;
  }

  subirEncuesta(){

  }
}
