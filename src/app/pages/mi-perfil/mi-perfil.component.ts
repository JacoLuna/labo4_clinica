import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Especialista } from '../../classes/personas/especialista';
import { MatListModule } from '@angular/material/list';
import { Paciente } from '../../classes/personas/paciente';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { Colecciones, DatabaseService } from '../../services/database.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [ MatButtonModule, MatCardModule, MatInput, MatInputModule, MatListModule, MatTabsModule, CommonModule, MatProgressSpinnerModule, HistoriaClinicaComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss',
})
export class MiPerfilComponent {
  cambio: boolean = false;
  cargando: boolean = false;

  especialista!: Especialista;
  paciente!: Paciente;
  protected horarios = [
    {horario: "08:00", seleccionado: false},
    {horario: "08:30", seleccionado: false},
    {horario: "09:00", seleccionado: false},
    {horario: "09:30", seleccionado: false},
    {horario: "10:00", seleccionado: false},
    {horario: "10:30", seleccionado: false},
    {horario: "11:00", seleccionado: false},
    {horario: "11:30", seleccionado: false},
    {horario: "12:00", seleccionado: false},
    {horario: "12:30", seleccionado: false},
    {horario: "13:00", seleccionado: false},
    {horario: "13:30", seleccionado: false},
    {horario: "14:00", seleccionado: false},
    {horario: "14:30", seleccionado: false},
    {horario: "15:00", seleccionado: false},
    {horario: "15:30", seleccionado: false},
    {horario: "16:00", seleccionado: false},
    {horario: "16:30", seleccionado: false},
    {horario: "17:00", seleccionado: false},
    {horario: "17:30", seleccionado: false},
    {horario: "18:00", seleccionado: false},
    {horario: "18:30", seleccionado: false},
    {horario: "19:00", seleccionado: false},
    {horario: "19:30", seleccionado: false},
    {horario: "20:00", seleccionado: false}]

  constructor(protected auth: AuthService, private db: DatabaseService) {
    switch (auth.UsuarioEnSesion?.tipoUsuario) {
      case 'especialista':
        this.especialista = <Especialista>auth.UsuarioEnSesion;
        console.log(this.especialista.especialidades)
        if(this.especialista.horarios.length > 0){
          this.especialista.horarios.forEach( hsEsp => {
            this.horarios.forEach( hs => {
              if(hsEsp == hs.horario){
                hs.seleccionado = true;
              }
            });
          });  
        }
        this.cargando = false;

        break;
      case 'paciente':
        this.paciente = <Paciente>auth.UsuarioEnSesion;
        break;
    }
  }

  seleccionarHorario(index: number){
    this.cambio = true;
    this.horarios[index].seleccionado = !this.horarios[index].seleccionado;
  }
  
  actualizarHorarios(){
    let HorariosSelect: string[] = [];
    this.cargando = true;
    this.horarios.forEach( hs => {
      if(hs.seleccionado)
        HorariosSelect.push(hs.horario);
    });
    this.db.actualizarDoc(Colecciones.Personas, this.especialista.id, {'horarios':HorariosSelect}).then( ()=> {
      this.cargando = false;
    });
    this.db.traerDoc<Especialista>(Colecciones.Personas, this.especialista.id).then( especialistaActualizado => {
      this.auth.UsuarioEnSesion = especialistaActualizado;
      this.especialista = <Especialista>this.auth.UsuarioEnSesion;
    });
  }
}
