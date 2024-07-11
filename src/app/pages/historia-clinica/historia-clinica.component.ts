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
import { VerReseniaComponent } from '../../components/ver-resenia/ver-resenia.component';
import { TurnoSeleccionadoComponent } from '../../components/turno-seleccionado/turno-seleccionado.component';
import { Turnos } from '../../classes/turnos';
import { MatTableModule } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, VerReseniaComponent, TurnoSeleccionadoComponent, MatTableModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.scss'
})
export class HistoriaClinicaComponent implements OnInit{
  cargando: boolean = true;
  persona!: Persona;
  personas: Persona[] = [];
  historiaClinica: HistoriaClinica[] = [];
  // turnos: Turnos[] = [];
  frmFiltro = new FormControl('');
  filteredOptions!: Observable<HistoriaClinica[]>;

  columnsTurno: string[] = [ 'especialidad', 'fecha', 'horario', 'medico', 'paciente', 'estado']; 
  
  constructor(protected auth: AuthService, protected db: DatabaseService, private excelService: ExcelService){
    this.cargando = true;
  }
  async ngOnInit(): Promise<void> {
    this.historiaClinica = await this.db.traerColeccion(Colecciones.HistoriaClinica);
    // this.turnos = await this.db.traerColeccion(Colecciones.Turnos);
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
      option.turno.paciente.toLowerCase().includes(filterValue) || 
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

  
  descargarPDF() {
    const doc = new jsPDF();

    // Encabezado del documento
    doc.text('Informe de Historial Clínica', 10, 10);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 10, 30);
    doc.addImage('assets/Logo.png', 'PNG', 150, 10, 30, 30);

    const tableColumn = ['Especialidad', 'Especialista', 'Fecha', 'Hora', 'Altura', 'Peso', 'Temperatura', 'Presión', 'Comentario', 'Datos 1', 'Datos 2', 'Datos 3'];
    const tableRows: any = [];
    let clave1 = '';
    let clave2 = '';
    let clave3 = '';
    let campo1 = '';
    let campo2 = '';
    let campo3 = '';

    this.historiaClinica.forEach(historiaClinica => {
    
      historiaClinica.datosAdicionales.forEach( (datoAdicional, index) => {
        switch(index){
          case 1:
            clave1 = datoAdicional.clave;
            campo1 = datoAdicional.campo;
            break;
          case 2:
            clave2 = datoAdicional.clave;
            campo2 = datoAdicional.campo;
            break;
          case 3:
            clave3 = datoAdicional.clave;
            campo3 = datoAdicional.campo;
            break;
        }
      })
      
      
      const turnoData = [
        historiaClinica.turno.especialidad,
        historiaClinica.turno.especialista,
        historiaClinica.turno.horario,,
        historiaClinica.altura || '',
        historiaClinica.peso || '',
        historiaClinica.temperatura || '',
        historiaClinica.presion || '',
        historiaClinica.comentario || '',
        `${clave1}:${campo1}` || '',
        `${clave2}:${campo2}` || '',
        `${clave3}:${campo3}` || '',
      ];
      tableRows.push(turnoData);
    })

    // Crear la tabla
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: {
        fillColor: [255, 255, 255], // Color de fondo de las celdas
        textColor: [0, 0, 0], // Color del texto
        fontSize: 10,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Color de fondo de la cabecera
        textColor: [255, 255, 255], // Color del texto de la cabecera
        fontSize: 12,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Color de fondo de las filas alternas
      },
    });

    // Guardar el PDF
    doc.save(`Historial_Clinico_${this.persona.nombre}_${this.persona.apellido}.pdf`);
  }

}
