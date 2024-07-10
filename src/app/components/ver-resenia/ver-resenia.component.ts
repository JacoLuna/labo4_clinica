import { Component, Input } from '@angular/core';
import { EncuestaCliente } from '../../classes/encuesta-cliente';
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

@Component({
  selector: 'app-ver-resenia',
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSliderModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './ver-resenia.component.html',
  styleUrl: './ver-resenia.component.scss'
})
export class VerReseniaComponent {

  frmEncuesta: FormGroup;

  @Input() turno: Turnos | undefined;
  @Input() Encuesta: EncuestaCliente | undefined;
  @Input() persona!: Persona;

  constructor(protected frmBuilder: FormBuilder){
    this.frmEncuesta = this.frmBuilder.group({
      'satisfaccion':[''],
      'comentario':['', [Validators.minLength(20), Validators.maxLength(300)]]
    })
  }

  subirEncuesta(){}
}
