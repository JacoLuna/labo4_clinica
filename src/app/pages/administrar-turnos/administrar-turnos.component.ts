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
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Persona } from '../../classes/personas/persona';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Admin } from '../../classes/personas/admin';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { TurnoSeleccionadoComponent } from '../../components/turno-seleccionado/turno-seleccionado.component';
import { VerReseniaComponent } from '../../components/ver-resenia/ver-resenia.component';
import { EncuestaPaciente } from '../../classes/encuesta-paciente';
import { BoldDirective } from '../../directives/bold.directive';
import { CursivaDirective } from '../../directives/cursiva.directive';


@Component({
  selector: 'app-administrar-turnos',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, MatActionList, MatList, MatListItem, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatTableModule, MatIconModule, MatButtonModule, MatCardModule, MatTooltipModule, MatSliderModule, MatInputModule, TurnoSeleccionadoComponent, VerReseniaComponent, BoldDirective, CursivaDirective],
  templateUrl: './administrar-turnos.component.html',
  styleUrl: './administrar-turnos.component.scss'
})
export class AdministrarTurnosComponent implements OnInit {
  cargando: boolean = true;
  persona!: Persona;
  turno: Turnos | undefined;
  encuesta: EncuestaPaciente | undefined;
  turnos: Turnos[] = [];
  personas: Persona[] = [];
  pacientes: Paciente[] = [];
  especialistas: Especialista[] = [];
  encuestas: EncuestaPaciente[] = [];
  frmFiltro = new FormControl('');
  filteredOptions!: Observable<Turnos[]>;

  columnsTurnoPendientes: string[] = [ 'especialidad', 'fecha', 'horario', 'medico', 'paciente', 'estado']; 
  // columnsTurno: string[] = [ 'especialidad', 'fecha', 'horario', 'medico', 'paciente', 'estado', 'cancelar', 'reseña', 'encuesta', 'atencion'];

  constructor(protected auth: AuthService, protected db: DatabaseService, protected frmBuilder: FormBuilder){
  }

  async ngOnInit(): Promise<void> {
    await this.cargarTurnos();
    this.cargando = false;
  }

  async cargarTurnos(){
    this.cargando = true;
    this.turnos = await this.db.traerColeccion<Turnos>(Colecciones.Turnos);
    this.encuestas = await this.db.traerColeccion<EncuestaPaciente>(Colecciones.Encuestas);
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

  async rowClicked(turno : Turnos){
    this.encuesta = undefined;
    this.turno = turno;
    if(turno.estado == 'finalizado'){
      this.encuesta = this.encuestas.filter(encuesta => encuesta.turno.id == this.turno!.id!)[0];
    }
  }
}
