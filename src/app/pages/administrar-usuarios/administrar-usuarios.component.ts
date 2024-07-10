import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { Especialista } from '../../classes/personas/especialista';
import { Paciente } from '../../classes/personas/paciente';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RegistroComponent } from '../registro/registro.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Admin } from '../../classes/personas/admin';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [MatTableModule, MatSlideToggleModule, RegistroComponent, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.scss',
})
export class AdministrarUsuariosComponent implements OnInit {
  displayedColumnsEspecialista: string[] = ['img', 'Nombre', 'Apellido', 'Dni', 'Edad', 'Correo', 'Especialidad', 'Autorizado'];
  displayedColumnsPaciente: string[] = ['img', 'Nombre','Apellido','Dni','Edad','Correo','Obra social'];
  displayedColumnsAdmin: string[] = ['img', 'Nombre','Apellido','Dni','Edad','Correo'];

  ELEMENT_DATA_especialista: Especialista[] = [];
  ELEMENT_DATA_paciente: Paciente[] = [];
  ELEMENT_DATA_admin: Admin[] = [];

  constructor(private db: DatabaseService) {}

  ngOnInit(): void {
    this.db.escucharColeccion(Colecciones.Personas, this.ELEMENT_DATA_especialista, ( p => {
      return p.tipoUsuario == 'especialista'
    }));
    this.db.escucharColeccion(Colecciones.Personas, this.ELEMENT_DATA_paciente, ( p => {
      return p.tipoUsuario == 'paciente'
    }));
    this.db.escucharColeccion(Colecciones.Personas, this.ELEMENT_DATA_admin, ( p => {
      return p.tipoUsuario == 'admin'
    }));
  }
  
  autorizar(click: MatSlideToggleChange, especialista: Especialista){
    this.db.actualizarDoc(Colecciones.Personas, especialista.id, {autorizado: click.checked});
  }
}
