import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { Persona } from '../../classes/persona';
import { Especialista } from '../../classes/especialista';
import { Paciente } from '../../classes/paciente';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AuthService } from '../../services/auth.service';

export interface elementoTabla {
  Nombre: string;
  Apellido: string;
  Edad: number;
  DNI: number;
}
// Correo: string;

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [MatTableModule, MatSlideToggleModule],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.scss',
})
export class AdministrarUsuariosComponent implements OnInit {
  // especialistas!: Especialista[];
  // pacientes!: Paciente[];
  // displayedColumns: string[] = ['Nombre', 'Apellido', 'Edad', 'DNI', 'Correo'];
  // displayedColumns: string[] = ['Nombre', 'Apellido', 'Edad', 'DNI'];

  especialistas: Especialista[] = [];
  pacientes: Paciente[] = [];

  ELEMENT_DATA: elementoTabla[] = [];

  constructor(private db: DatabaseService) {}
  ngOnInit(): void {
    /*
    this.db.traerColeccion<Persona>(Colecciones.Personas).then((r) => {
      this.personas = r;
      this.personas.forEach((p) => {
        this.ELEMENT_DATA.push({
          Nombre: p.nombre,
          Apellido: p.apellido,
          Edad: Number(p.edad),
          DNI: Number(p.dni),
        });
        // Correo : p.correo,
      });
      });
    */

    this.db.traerColeccion<Especialista>(Colecciones.Especialistas).then((r) => {
      this.especialistas = r;
    });

    // this.db.traerColeccion<Especialista>(Colecciones.Especialistas).then((r) => {
    //   this.especialistas = r;
    // });

    this.db.traerColeccion<Persona>(Colecciones.Personas).then((r) => {
      r.forEach( p => {
        if(p.tipoUsuario != 'especialista'){
          this.pacientes.push(p);
        }
      })
    });
  }
  // dataSource = this.personas;
  autorizar(click: MatSlideToggleChange, especialista: Especialista){
    this.db.actualizarDoc(Colecciones.Especialistas, especialista.id, {autorizado: click.checked});
  }
}
