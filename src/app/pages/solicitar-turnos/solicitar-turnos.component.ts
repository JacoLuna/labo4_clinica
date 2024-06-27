import { Component, OnInit } from '@angular/core';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Especialista } from '../../classes/especialista';
import { especialidad } from '../../components/form-datos-especificos/form-datos-especificos.component';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-solicitar-turnos',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, MatAutocompleteModule, AsyncPipe],
  templateUrl: './solicitar-turnos.component.html',
  styleUrl: './solicitar-turnos.component.scss'
})
export class SolicitarTurnosComponent implements OnInit{

  filteredMedicos!: Observable<Especialista[]>;
  medicos: Especialista[] = [];
  filteredMedicosByUser: Observable<especialidad[]> | undefined;
  filteredEspecialidades!: Observable<especialidad[]>;
  especialidades: especialidad[] = [];
  filteredEspecialidadesByUser: especialidad[] = [];

  frmTurno: FormGroup;
  constructor(protected auth: AuthService, protected db: DatabaseService, protected frmBuilder: FormBuilder){
    this.frmTurno = frmBuilder.group({
      'especialista': [''],
      'especialidad': [''],
      'hora': [''],
      'fecha': ['']
    });

    this.db.escucharColeccion(Colecciones.Personas, this.medicos, ( esp => {
      if(esp.tipoUsuario == 'especialista')
        return true
      else
        return false 
    }))

    this.db.escucharColeccion(Colecciones.Especialidades, this.especialidades);
    this.filtrarEspecialidades();
    this.filtrarMedicos();
  }


  ngOnInit(): void {
  }

  displayMedicosFn(objeto: Especialista): string {
    return objeto && objeto.nombre ? objeto.nombre : '';
  }
  private _filterMedicos(nombre: string, item?: MatOptionSelectionChange): Especialista[]{
    const filterValue = nombre.toLowerCase();
    return this.medicos.filter((option) => {
      if(item){
        return option.especialidades.includes(item.source.value.nombre);
      }else{
        return option.nombre.toLowerCase().includes(filterValue);
      }
    });
    
  }

  displayEspecialidadesFn(objeto: especialidad): string {
    return objeto && objeto.nombre ? objeto.nombre : '';
  }
  private _filterEspecialidades(nombre: string):especialidad[] {
    const filterValue = nombre.toLowerCase();
    return this.especialidades.filter((option) => {
      return option.nombre.toLowerCase().includes(filterValue);
    });
  }

  especialidadSelected(item: MatOptionSelectionChange){
    this.filteredMedicosByUser = this.frmTurno.controls['especialista'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre ? this._filterMedicos(nombre as string, item) : this.medicos.slice();
      })
    );
  }

  filtrarMedicos() {
    this.filteredMedicos = this.frmTurno.controls['especialista'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre ? this._filterMedicos(nombre as string) : this.medicos.slice();
      })
    );
  }
  filtrarEspecialidades() {
    this.filteredEspecialidades = this.frmTurno.controls['especialidad'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre
          ? this._filterEspecialidades(nombre as string)
          : this.especialidades.slice();
      })
    );
  }
}

