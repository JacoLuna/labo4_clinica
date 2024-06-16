import { Component, EventEmitter, Output, ViewChild, output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { StorageService } from '../../services/storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-form-datos-personales',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatCardModule,
    MatAutocompleteModule,
    FormDatosPersonalesComponent,
    MatTabsModule,
  ],
  templateUrl: './form-datos-personales.component.html',
  styleUrl: './form-datos-personales.component.scss',
})
export class FormDatosPersonalesComponent {
  @Output() nextEvent = new EventEmitter<FormGroup>();
  
  hide : boolean = false;
  frmDatosPersonales!: FormGroup;

  errrorCampoObligatorio = 'Este campo es obligatorio';
  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private bd: DatabaseService
  ) {
    this.frmDatosPersonales = this.formBuilder.group({
      nombre : new FormControl(''),
      apellido : new FormControl(''),
      edad : new FormControl(''),
      DNI : new FormControl('', [Validators.minLength(7), Validators.maxLength(9)]),
      email : new FormControl('', [Validators.email]),
      clave : new FormControl('', [Validators.minLength(6)]),
      claveRepetida : new FormControl('', [Validators.minLength(6)]),
    });
  }

  seePass(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
  siguiente(){
    this.nextEvent.emit(this.frmDatosPersonales);
  }

  fillFields() {
    this.frmDatosPersonales.controls['nombre'].setValue('juan');
    this.frmDatosPersonales.controls['apellido'].setValue('perez');
    this.frmDatosPersonales.controls['edad'].setValue('22');
    this.frmDatosPersonales.controls['DNI'].setValue('12345678');
    this.frmDatosPersonales.controls['email'].setValue('email@gmail.com');
    this.frmDatosPersonales.controls['clave'].setValue('123456');
    this.frmDatosPersonales.controls['claveRepetida'].setValue('123456');
  }
}
