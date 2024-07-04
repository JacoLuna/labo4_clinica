import { Component, OnInit } from '@angular/core';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Especialista } from '../../classes/especialista';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Especialidad } from '../../classes/especialidad';
import { MatCardModule } from '@angular/material/card';
import { C } from '@angular/cdk/keycodes';
import { Turnos } from '../../classes/turnos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../services/snack-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitar-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon,MatSelectModule, MatSelect, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './solicitar-turnos.component.html',
  styleUrl: './solicitar-turnos.component.scss'
})
export class SolicitarTurnosComponent implements OnInit{

  cargando: boolean = false;
  medicos: Especialista[] = [];
  filteredMedicos!: Especialista[];
  
  especialidades: Especialidad[] = [];
  filteredEspecialidades: Especialidad[] = [];

  frmTurno: FormGroup;

  currDate: Date = new Date();
  dateStr: string = "";
  dias: {dia: string, selected: boolean, disponible: boolean}[] = [];
  
  
  // diasNoOcupados: {
  //   dia: string;
  //   selected: boolean;
  // }[] = [];
  
  
  protected horarios = [
    {horario: "08:00", seleccionado: false, disponile: true},
    {horario: "08:30", seleccionado: false, disponile: true},
    {horario: "09:00", seleccionado: false, disponile: true},
    {horario: "09:30", seleccionado: false, disponile: true},
    {horario: "10:00", seleccionado: false, disponile: true},
    {horario: "10:30", seleccionado: false, disponile: true},
    {horario: "11:00", seleccionado: false, disponile: true},
    {horario: "11:30", seleccionado: false, disponile: true},
    {horario: "12:00", seleccionado: false, disponile: true},
    {horario: "12:30", seleccionado: false, disponile: true},
    {horario: "13:00", seleccionado: false, disponile: true},
    {horario: "13:30", seleccionado: false, disponile: true},
    {horario: "14:00", seleccionado: false, disponile: true},
    {horario: "14:30", seleccionado: false, disponile: true},
    {horario: "15:00", seleccionado: false, disponile: true},
    {horario: "15:30", seleccionado: false, disponile: true},
    {horario: "16:00", seleccionado: false, disponile: true},
    {horario: "16:30", seleccionado: false, disponile: true},
    {horario: "17:00", seleccionado: false, disponile: true},
    {horario: "17:30", seleccionado: false, disponile: true},
    {horario: "18:00", seleccionado: false, disponile: true},
    {horario: "18:30", seleccionado: false, disponile: true},
    {horario: "19:00", seleccionado: false, disponile: true},
    {horario: "19:30", seleccionado: false, disponile: true},
    {horario: "20:00", seleccionado: false, disponile: true}
  ]
  
  constructor(protected auth: AuthService, protected db: DatabaseService, protected frmBuilder: FormBuilder, 
    private snackBar: SnackBarService, private nav: Router){
    this.frmTurno = frmBuilder.group({
      'especialista': ['',],
      'especialidad': ['',],
      'hora': ['',Validators.required],
      'fecha': ['', Validators.required]
    });

    this.db.escucharColeccion(Colecciones.Personas, this.medicos, ( esp => {
      let retorno = false;
      if(esp.tipoUsuario == 'especialista') 
        retorno = true;
      return retorno;
    }))
    this.db.escucharColeccion(Colecciones.Especialidades, this.especialidades);

    this.filteredMedicos = this.medicos;
    this.filteredEspecialidades = this.especialidades;
  }

  ngOnInit(): void {
    this.dateInterval();
  }

  dateInterval(){
    let cont = 0;
    do{
      this.currDate.setDate(this.currDate.getDate() + 1);
      if(this.currDate.toDateString().split(" ")[0] != ('Sat' || 'Sun')){
        this.dias.push({dia: this.currDate.getDate() + "/" + this.currDate.getMonth(), selected: false, disponible: true});
        cont++;
      }
    }while(cont < 15)
  }
  /*
  onNoneEspecialidadSelected(){
    this.filteredMedicos = this.medicos;
    this.filteredEspecialidades = this.especialidades;

    this.horarios.forEach( (horario) => {
      horario.seleccionado = false; 
    })
  }
  onNoneMedicoSelected(){
    this.filteredEspecialidades = this.especialidades;
    this.filteredMedicos = this.medicos;

    this.horarios.forEach( (horario) => {
      horario.seleccionado = false; 
    })
  }*/
  
  onEspecialidadSelected(especialidad: Especialidad){
    this.filteredMedicos = this.medicos.filter( medico => {
      return medico.especialidades.includes(especialidad.nombre);
    })
  }

  onMedicoSelected(medico: Especialista){
    this.filteredEspecialidades = this.especialidades.filter( esp => {
      return medico.especialidades.includes(esp.nombre);
    })
  }

  selectHorario(hs:{horario: string, seleccionado: boolean, disponile: boolean}){
    this.horarios.forEach( (horario) => {
      horario.seleccionado = false; 
    })
    this.horarios[this.horarios.indexOf(hs)].seleccionado = !this.horarios[this.horarios.indexOf(hs)].seleccionado;
    this.frmTurno.controls['hora'].setValue(this.horarios[this.horarios.indexOf(hs)].horario); 

    this.dias.forEach( dia => {
      dia.disponible = true;
    });
    
    if(this.frmTurno.controls['especialista'].value){
      (<Especialista>this.frmTurno.controls['especialista'].value).turnos.forEach( turno => {
        this.dias.forEach( dia => {
          if(turno.fecha == dia.dia + "/" + this.currDate.toDateString().split(' ')[3] && turno.horario == hs.horario){
            dia.disponible = false
            dia.selected = false;
            this.frmTurno.controls['fecha'].setValue('');
          }
        })
      })
    }
  }
  selectDia(indice: number){
    this.dias.forEach( (dia) => {
      dia.selected = false; 
    })
    this.dias[indice].selected = true;
    this.frmTurno.controls['fecha'].setValue(this.dias[indice].dia + "/" + this.currDate.toDateString().split(' ')[3]); 
  }
  async sacarTurno(){
    if(this.frmTurno.valid){
      this.cargando = true;
      let medico = <Especialista>this.frmTurno.controls['especialista'].value;
      let fecha = this.frmTurno.controls['fecha'].value;
      let horario = this.frmTurno.controls['hora'].value;
      let turno: Turnos = new Turnos(
        this.frmTurno.controls['especialista'].value.id,
        this.frmTurno.controls['especialidad'].value.id,
        this.frmTurno.controls['hora'].value,
        this.frmTurno.controls['fecha'].value,
      )
      // this.medicos.find(especialista => {especialista == medico})?.sacarTurno({fecha, horario});
      
      this.db.subirDoc(Colecciones.Turnos, turno).then( ()=> {
        medico.turnos.push({fecha, horario});
        this.db.actualizarDoc(Colecciones.Personas, medico.id, {turnos: medico.turnos}).then( ()=> {

          this.cargando = false;
          this.snackBar.succesSnackBar('Turno hecho ', 'Ok', 2000);
          this.nav.navigate(['/home']);
        })
      });
    }
  }
}

