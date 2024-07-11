import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { Turnos } from '../../classes/turnos';
import { Especialidad } from '../../classes/especialidad';
import  Chart, { ChartData, ChartType } from 'chart.js/auto';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule} from '@angular/material/radio';
import { Log } from '../../classes/log';
import { ExcelService } from '../../services/excel.service';
import { ResaltarDirective } from '../../directives/resaltar.directive';
import { CursivaDirective } from '../../directives/cursiva.directive';
import { BoldDirective } from '../../directives/bold.directive';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatSliderModule, ReactiveFormsModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatTableModule, MatCardModule, MatRadioModule, ResaltarDirective, CursivaDirective, BoldDirective],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.scss',
})
export class GraficosComponent implements OnInit{
  cargando: boolean = false;
  turnos: Turnos[] = [];
  especialidades: Especialidad[] = [];
  logs: Log[] = [];
  turnosEspecialidadData: {especialidad: string, Cantidad: number}[] = [];
  turnosDia: {fecha: string, Cantidad: number}[] = [];
  turnosPedidos: {fecha: string, Cantidad: number}[] = [];
  turnosFinalizados: {fecha: string, Cantidad: number}[] = [];
  charts: Chart[] = [];
  frmFechaPendiente: FormGroup;
  frmFechaFinalizado: FormGroup;
  dias : number[] = [];
  minDate : number = 0;
  maxDate : number = 0;
  columnsLog: string[] = ['usuario', 'fecha', 'horario']; 
  especialidadTipo: string = 'bar';
  diaTipo: string = 'bar';
  turnosSolicitadosTipo: string = 'bar';
  turnosFinalizadosTipo: string = 'bar';
  constructor(private db: DatabaseService, private frmBuilder: FormBuilder, private excel: ExcelService){
    this.frmFechaPendiente = this.frmBuilder.group({
      limiteInferior:[''],
      limiteSuperior:['']
    })
    this.frmFechaFinalizado = this.frmBuilder.group({
      limiteInferior:[''],
      limiteSuperior:['']
    })
  }

  formatLabel(value: number): string {
    return `${new Date(value * 1000).toDateString().split(' ')[1]} ${new Date(value * 1000).toDateString().split(' ')[2]}`;
  }

  async ngOnInit(){
    this.cargando = true;
    this.turnos = await this.db.traerColeccion(Colecciones.Turnos);    
    this.especialidades = await this.db.traerColeccion(Colecciones.Especialidades);
    this.logs = await this.db.traerColeccion(Colecciones.Log);
    console.log(this.logs);
    const uniqueArray = this.turnos.filter(
      (obj, index, self) =>
        index === self.findIndex((t) => t.fecha === obj.fecha)
      );
    uniqueArray.forEach( turno => this.dias.push(Math.floor(new Date(turno.fecha).getTime() / 1000)));
    this.dias.sort((a, b) =>{
      if(a > b) 
        return 1
      else if(a < b)
        return -1
      return 0
    })
    this.minDate = this.dias[0];
    this.maxDate = this.dias[this.dias.length-1];
    this.frmFechaPendiente.controls['limiteInferior'].setValue(this.minDate);
    this.frmFechaPendiente.controls['limiteSuperior'].setValue(this.maxDate);
    this.frmFechaFinalizado.controls['limiteInferior'].setValue(this.minDate);
    this.frmFechaFinalizado.controls['limiteSuperior'].setValue(this.maxDate);

    this.turnosSolicitadosChart();
    this.especialidadChart();
    this.diaChart();
    this.turnosFinalizadosChart();
    this.cargando = false;
  }

  changeGrafico(nroChart:number){
    switch(nroChart){
      case 0:
        this.especialidadChart(<ChartType>this.especialidadTipo);
      break;
      case 1:
        console.log(this.diaTipo);
        this.diaChart(<ChartType>this.diaTipo);
      break;
      case 2:
        this.turnosSolicitadosChart(<ChartType>this.turnosSolicitadosTipo);
      break;
      case 3:
        this.turnosFinalizadosChart(<ChartType>this.turnosFinalizadosTipo);
      break;
    }
  }
  especialidadChart(grafico: ChartType = 'bar'){
    if(this.charts[0]){
      this.charts[0].destroy();
      this.turnosEspecialidadData.length = 0;
    }
    const uniqueArray = this.turnos.filter(
      (obj, index, self) =>
        index === self.findIndex((t) => t.especialidad === obj.especialidad)
      );
    uniqueArray.forEach( e => this.turnosEspecialidadData.push({especialidad : e.especialidad, Cantidad : 0}));
    this.turnosEspecialidadData.forEach( turnoEsp => {
      this.turnos.forEach( turno => {
        if(turno.especialidad == turnoEsp.especialidad){
          turnoEsp.Cantidad++;
        }
      })
    })
    this.charts[0] = this.createChart(grafico,'especialidadChart',
        {
          labels:this.turnosEspecialidadData.map(row => row.especialidad),
          datasets: [
            {
            label: 'turnos',
            data: this.turnosEspecialidadData.map(row => row.Cantidad),
            borderWidth: 1
            }
          ]
        }
      )
  }

  diaChart(grafico: ChartType = 'bar'){
    if(this.charts[1]){
      this.charts[1].destroy();
      this.turnosDia.length = 0;
    }
    this.dias.forEach( dia => this.turnosDia.push({fecha : new Date(dia * 1000).toString(), Cantidad : 0}));
    this.turnosDia.forEach( turnoDia => {
      this.turnos.forEach( turno => {
        if(turno.fecha == turnoDia.fecha){
          turnoDia.Cantidad++;
        }
      })
    })
    
    this.charts[1] = 
      this.createChart(grafico,'diaChart',
      {
        labels:this.turnosDia.map(row => row.fecha.split(' ')[2] + " " + row.fecha.split(' ')[1]),
        datasets: [
          {
          label: 'dias',
          data: this.turnosDia.map(row => row.Cantidad),
          borderWidth: 1
          }]
      })
    
  }

  turnosSolicitadosChart(grafico: ChartType | string = 'bar'){
    if(this.charts[2]){
      this.charts[2].destroy();
      this.turnosPedidos.length = 0;
    }
    this.dias.forEach( dia => {
      if(dia >= this.frmFechaPendiente.controls['limiteInferior'].value &&
         dia <= this.frmFechaPendiente.controls['limiteSuperior'].value ){
           this.turnosPedidos.push({fecha : new Date(dia * 1000).toString(), Cantidad : 0})
         }
    });
    this.turnosPedidos.forEach( turnoDia => {
      this.turnos.forEach( turno => {
        if(turno.fecha == turnoDia.fecha && 
          turno.estado == 'pendiente'){
          turnoDia.Cantidad++;
        }
      })
    })
    this.charts[2] =
      this.createChart(<ChartType>grafico,'turnosSolicitadosChart',
      {
        labels:this.turnosPedidos.filter(row => row.Cantidad > 0).map(row => row.fecha.split(' ')[2] + " " + row.fecha.split(' ')[1]),
        datasets: [
          {
          label: 'dias',
          data: this.turnosPedidos.filter(row => row.Cantidad > 0).map(row => row.Cantidad),
          borderWidth: 1
          }]
      })
  }

  turnosFinalizadosChart(grafico: ChartType | string = 'bar'){
    if(this.charts[3]){
      this.charts[3].destroy();
      this.turnosFinalizados.length = 0;
    }
    this.dias.forEach( dia => {
      if(dia >= this.frmFechaFinalizado.controls['limiteInferior'].value &&
         dia <= this.frmFechaFinalizado.controls['limiteSuperior'].value ){
           this.turnosFinalizados.push({fecha : new Date(dia * 1000).toString(), Cantidad : 0})
         }
    });
    this.turnosFinalizados.forEach( turnoDia => {
      this.turnos.forEach( turno => {
        if(turno.fecha == turnoDia.fecha && 
          turno.estado == 'finalizado'){
          turnoDia.Cantidad++;
        }
      })
    })
    this.charts[3] =
      this.createChart(<ChartType>grafico,'turnosFinalizadosChart',
      {
        labels:this.turnosFinalizados.filter(row => row.Cantidad > 0).map(row => row.fecha.split(' ')[2] + " " + row.fecha.split(' ')[1]),
        datasets: [
          {
          label: 'dias',
          data: this.turnosFinalizados.filter(row => row.Cantidad > 0).map(row => row.Cantidad),
          borderWidth: 1
          }]
      })
  }

  createChart(tipoGrafico: ChartType, nombre: string, data: ChartData){
    const ctx = <HTMLCanvasElement>document.getElementById(nombre);
    return new Chart(ctx, {
      type: tipoGrafico,
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  exportar(nroChart?:number){
    switch(nroChart){
      case 0:
        this.excel.generateExcel(this.turnosEspecialidadData,`grafico${nroChart}`);
      break;
      case 1:
        this.excel.generateExcel(this.turnosDia,`grafico${nroChart}`);
      break;
      case 2:
        this.excel.generateExcel(this.turnosPedidos,`grafico${nroChart}`);
      break;
      case 3:
        this.excel.generateExcel(this.turnosFinalizados,`grafico${nroChart}`);
      break;
      default:
        this.excel.generateExcel(this.logs,`logs`);
        break;
    }
  }
}
