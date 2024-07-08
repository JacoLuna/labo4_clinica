import { Component, OnInit } from '@angular/core';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import { Especialista } from '../../classes/personas/especialista';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Especialidad } from '../../classes/especialidad';
import { MatCardModule } from '@angular/material/card';
import { C } from '@angular/cdk/keycodes';
import { Turnos } from '../../classes/turnos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../services/snack-bar.service';
import { Router } from '@angular/router';
import { Paciente } from '../../classes/personas/paciente';
import { Persona } from '../../classes/personas/persona';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-solicitar-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon,MatSelectModule, MatSelect, MatCardModule, MatProgressSpinnerModule, MatStepperModule, MatTooltipModule],
  templateUrl: './solicitar-turnos.component.html',
  styleUrl: './solicitar-turnos.component.scss'
})
export class SolicitarTurnosComponent implements OnInit{

  medicos: Especialista[] = [];
  filteredMedicos!: Especialista[];
  selectedMedico!: Especialista;

  especialidades: Especialidad[] = [];

  pacientes: Paciente[] = [];
  selectePaciente!: Paciente;

  turnos: Turnos[] = [];
  cargando: boolean = false;
  frmTurno: FormGroup;
  currDate: Date = new Date();
  dateStr: string = "";
  
  
  dias: {dia: string, selected: boolean, disponible: boolean}[] = [];
  protected horarios : {horario: string, seleccionado: boolean, disponible: boolean}[]= []
  
  constructor(protected auth: AuthService, protected db: DatabaseService, protected frmBuilder: FormBuilder, 
    private snackBar: SnackBarService, private nav: Router){
      this.cargando = true;
    this.frmTurno = frmBuilder.group({
      'paciente': ['',],
      'especialista': ['',],
      'especialidad': ['',],
      'hora': ['',Validators.required],
      'fecha': ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.especialidades = await this.db.traerColeccion(Colecciones.Especialidades);
    if(this.auth.UsuarioEnSesion?.tipoUsuario == 'admin')
      this.turnos = await this.db.traerColeccion(Colecciones.Turnos);
    this.db.traerColeccion<Persona>(Colecciones.Personas).then( personas => {
      personas.forEach( persona => {
        if(persona.tipoUsuario == 'especialista')
          this.medicos.push(<Especialista>persona);
        else if(persona.tipoUsuario == 'paciente')
          this.pacientes.push(<Paciente>persona);
      })
    })
    
    this.dateInterval();
    this.cargando = false;
  }

  dateInterval(){
    let cont = 0;
    do{
      this.currDate.setDate(this.currDate.getDate() + 1);
      if(this.currDate.toDateString().split(" ")[0] != ('Sat' || 'Sun')){
        this.currDate.setHours(0,0,0,0);
        this.dias.push({dia: this.currDate.toString(), selected: false, disponible: true});
        cont++;
      }
    }while(cont < 15)
  }

  selectPaciente(paciente: Paciente){
    this.frmTurno.controls['paciente'].setValue(paciente.id);
    this.selectePaciente = paciente;
  }
  selectMedico(medico: Especialista){
    this.selectedMedico = medico; 
    this.frmTurno.controls['especialista'].setValue(medico.id);

    this.horarios.length = 0;
    medico.horarios.forEach( hs => {
      this.horarios.push({horario: hs, seleccionado: false, disponible: true})
    })
  }
  selectHorario(hs:{horario: string, seleccionado: boolean, disponible: boolean}){
    this.horarios.forEach( (horario) => {
      horario.seleccionado = false; 
    })
    this.horarios[this.horarios.indexOf(hs)].seleccionado = !this.horarios[this.horarios.indexOf(hs)].seleccionado;
    this.frmTurno.controls['hora'].setValue(this.horarios[this.horarios.indexOf(hs)].horario); 
    this.dias.forEach( dia => {
      dia.disponible = true;
    });
    
    this.selectedMedico.turnos.forEach( turno => {
        this.dias.forEach( dia => {
          if(turno.fecha === dia.dia && turno.horario == hs.horario){
            dia.disponible = false
            if(dia.selected){
              dia.selected = false;
              this.frmTurno.controls['hora'].setValue('');
            }
          }
        })
      })
    
  }

  selectDia(dia:{dia: string, selected: boolean, disponible: boolean}){
    this.dias.forEach( (dia) => {
      dia.selected = false; 
    })
    this.dias[this.dias.indexOf(dia)].selected = !this.dias[this.dias.indexOf(dia)].selected;
    this.frmTurno.controls['fecha'].setValue(this.dias[this.dias.indexOf(dia)].dia); 

    this.horarios.forEach( horario => {
      horario.disponible = true;
    });
    this.selectedMedico.turnos.forEach( turno => {
      this.horarios.forEach( horario => {
        if(this.frmTurno.controls['paciente'].value != ''){
          this.selectePaciente.turnos.forEach( turnoPaciente => {
            if(turnoPaciente.horario == horario.horario || turno.horario == horario.horario && turno.fecha == dia.dia){
              horario.disponible = false
              if(horario.seleccionado){
                horario.seleccionado = false;
                this.frmTurno.controls['fecha'].setValue('');
              }
            }  
          })
        }
        if(turno.horario == horario.horario && turno.fecha == dia.dia){
          horario.disponible = false
          if(horario.seleccionado){
            horario.seleccionado = false;
            this.frmTurno.controls['fecha'].setValue('');
          }
        }
      })
    })
    

  }

  selectEspecialidad(event: Event){
    this.frmTurno.controls['especialidad'].setValue((<HTMLImageElement>event.target).alt);
    this.filteredMedicos = this.medicos.filter( 
      medico => medico.especialidades.includes(this.frmTurno.controls['especialidad'].value));
  }

  async sacarTurno(){
    console.log(this.frmTurno)
    if(this.frmTurno.valid){
      this.cargando = true;
      let fecha = this.frmTurno.controls['fecha'].value;
      let horario = this.frmTurno.controls['hora'].value;
      let idPaciente = 
        this.auth.UsuarioEnSesion!.tipoUsuario == 'paciente'? this.auth.UsuarioEnSesion!.id: this.frmTurno.controls['paciente'].value 
      let turno: Turnos = new Turnos(
        this.selectedMedico.id,
        idPaciente,
        this.frmTurno.controls['especialidad'].value,
        horario,
        fecha,
      )
      await this.db.subirDoc(Colecciones.Turnos, turno);
      this.selectedMedico.turnos.push({fecha, horario});
      this.selectePaciente.turnos.push({fecha, horario});
      await this.db.actualizarDoc(Colecciones.Personas, this.selectedMedico.id, {turnos: this.selectedMedico.turnos});
      await this.db.actualizarDoc(Colecciones.Personas, idPaciente, {turnos: this.selectePaciente.turnos});
      
      this.cargando = false;
      this.snackBar.succesSnackBar('Turno hecho ', 'Ok', 2000);
      this.nav.navigate(['/home']);
    }
  }
}

