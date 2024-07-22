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
import { Especialidad } from '../../classes/especialidad';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [MatTableModule, MatSlideToggleModule, RegistroComponent, MatProgressSpinnerModule, MatCardModule, MatButtonModule, CommonModule],
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

  especialidades: Especialidad[] = [];
  img!: File;
  picCanceled: boolean = false;
  cargando = false;

  constructor(private db: DatabaseService, private storage: StorageService) {}

  async ngOnInit() {
    this.db.escucharColeccion(Colecciones.Personas, this.ELEMENT_DATA_especialista, ( p => {
      return p.tipoUsuario == 'especialista'
    }));
    this.db.escucharColeccion(Colecciones.Personas, this.ELEMENT_DATA_paciente, ( p => {
      return p.tipoUsuario == 'paciente'
    }));
    this.db.escucharColeccion(Colecciones.Personas, this.ELEMENT_DATA_admin, ( p => {
      return p.tipoUsuario == 'admin'
    }));
    this.especialidades = await this.db.traerColeccion<Especialidad>(Colecciones.Especialidades);
  }
  
  autorizar(click: MatSlideToggleChange, especialista: Especialista){
    this.db.actualizarDoc(Colecciones.Personas, especialista.id, {autorizado: click.checked});
  }

  cambiarFoto($event: any, especialidad: Especialidad) {
    if ($event.target.files.length > 0) {
      this.cargando = true;
      console.log($event.target.files[0])
      this.storage
        .subirArchivo($event.target.files[0], 'especialidades',especialidad.nombre)
        .then(async (urlImg) => {
          this.db.actualizarDoc(Colecciones.Especialidades, especialidad.id, {fotoUrl: urlImg});
          this.especialidades = await this.db.traerColeccion<Especialidad>(Colecciones.Especialidades);
          this.cargando = false;
        });
    }
  }
}
