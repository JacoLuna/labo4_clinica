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
import { AsyncPipe, CommonModule } from '@angular/common';
import { Especialista } from '../../classes/especialista';
import { especialidad } from '../../components/form-datos-especificos/form-datos-especificos.component';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-solicitar-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, MatAutocompleteModule, AsyncPipe],
  templateUrl: './solicitar-turnos.component.html',
  styleUrl: './solicitar-turnos.component.scss'
})
export class SolicitarTurnosComponent implements OnInit{

  filteredMedicos!: Observable<Especialista[]>;
  // filteredMedicos!: Especialista[];
  medicos: Especialista[] = [];
  // filteredMedicosByUser!: Observable<Especialista[]>;
  medicoSelected!: Especialista;

  filteredEspecialidades!: Observable<especialidad[]>;
  especialidades: especialidad[] = [];
  filteredEspecialidadesByUser: especialidad[] = [];
  especialidadSelected: especialidad | undefined;

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
  }


  ngOnInit(): void {
  }

}

