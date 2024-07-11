import { Component, Input } from '@angular/core';
import { EncuestaPaciente } from '../../classes/encuesta-paciente';
import { Persona } from '../../classes/personas/persona';
import { Turnos } from '../../classes/turnos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Colecciones, DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-ver-resenia',
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSliderModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './ver-resenia.component.html',
  styleUrl: './ver-resenia.component.scss'
})
export class VerReseniaComponent {
  @Input() turnoInput: Turnos | undefined;
  _encuestaInput!: EncuestaPaciente;
  @Input() persona!: Persona;
 
  @Input() set encuestaInput(value: EncuestaPaciente) {
    this._encuestaInput = value;
    this.frmEncuesta.controls['satisfaccion'].setValue(this._encuestaInput.satisfaccion);
    this.frmEncuesta.controls['comentario'].setValue(this._encuestaInput.comentario);
  }

  frmEncuesta: FormGroup;
  cargando: boolean = false;

  constructor(protected frmBuilder: FormBuilder, private db: DatabaseService){
    this.frmEncuesta = this.frmBuilder.group({
      'satisfaccion':[''],
      'comentario':['', [Validators.minLength(20), Validators.maxLength(300)]]
    })
  }

  async subirEncuesta(){
    this.cargando = true;
    await this.db.actualizarDoc(Colecciones.Turnos, this.turnoInput!.id, {comentarioPaciente: this.frmEncuesta.controls['comentario'].value});
    let encuesta =
    new EncuestaPaciente(this.turnoInput!, this.turnoInput!.paciente, this.turnoInput!.especialista, this.frmEncuesta.controls['satisfaccion'].value, this.frmEncuesta.controls['comentario'].value)
    await this.db.subirDoc(Colecciones.Encuestas, encuesta);
    this.turnoInput = undefined;
    this.cargando = false;
  }
}
