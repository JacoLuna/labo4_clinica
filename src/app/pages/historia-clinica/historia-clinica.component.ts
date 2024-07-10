import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { HistoriaClinica } from '../../classes/historia-clinica';
import { Observable, startWith, map } from 'rxjs';
import { Admin } from '../../classes/personas/admin';
import { Especialista } from '../../classes/personas/especialista';
import { Paciente } from '../../classes/personas/paciente';
import { Persona } from '../../classes/personas/persona';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.scss'
})
export class HistoriaClinicaComponent implements OnInit{
  cargando: boolean = true;
  persona!: Persona;
  personas: Persona[] = [];
  historiaClinica: HistoriaClinica[] = [];
  frmFiltro = new FormControl('');
  filteredOptions!: Observable<HistoriaClinica[]>;

  constructor(protected auth: AuthService, protected db: DatabaseService, private excelService: ExcelService){
    this.cargando = true;
    
  }
  async ngOnInit(): Promise<void> {
    this.historiaClinica = await this.db.traerColeccion(Colecciones.HistoriaClinica);
    switch(this.auth.UsuarioEnSesion?.tipoUsuario){
      case 'admin':
        this.personas = await this.db.traerColeccion(Colecciones.Personas);
        this.persona = <Admin>this.auth.UsuarioEnSesion;
      break;
      case 'especialista':
        this.persona = <Especialista>this.auth.UsuarioEnSesion;
        this.historiaClinica = this.historiaClinica.filter( historia => historia.turno.idMedico == this.persona.id);
      break;
      case 'paciente':
        this.persona = <Paciente>this.auth.UsuarioEnSesion;
        this.historiaClinica = this.historiaClinica.filter( historia => historia.turno.idPaciente == this.persona.id);
      break;
    }
    this.filteredOptions = this.frmFiltro.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '' )),
    );
    this.cargando = false;
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    
    return this.historiaClinica.
    filter(option => 
      option.turno.especialista.toLowerCase().includes(filterValue) || 
      option.comentario.toLowerCase().includes(filterValue) ||  
      option.datosAdicionales.forEach( e => e.campo.toLowerCase().includes(filterValue)) ||
      option.datosAdicionales.forEach( e => e.clave.toLowerCase().includes(filterValue)) ||
      option.altura.toString().includes(filterValue) ||
      option.presion.toString().includes(filterValue) ||
      option.peso.toString().includes(filterValue) ||
      option.temperatura.toString().includes(filterValue) ||
      option.turno.fecha.includes(filterValue) ||
      option.turno.horario.includes(filterValue)
    );
  }

  exportToExcel(): void {
    this.excelService.generateExcel(this.personas, 'usuarios');
  }
}
