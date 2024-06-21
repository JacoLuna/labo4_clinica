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
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

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
    MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction
  ],
  templateUrl: './form-datos-personales.component.html',
  styleUrl: './form-datos-personales.component.scss',
})
export class FormDatosPersonalesComponent {
  @Output() nextEvent = new EventEmitter<FormGroup>();
  
  hide : boolean = true;
  frmDatosPersonales: FormGroup;

  errrorCampoObligatorio = 'Este campo es obligatorio';
  errrorMinChar = 'El minimo de caracteres es de 6';
  errrorMin = 'Valor menor al aceptado';
  errrorMax = 'Valor mayor al aceptado';
  errrorDNIFormat = 'Ese formato no es de dni';
  errrorMailFormat = 'Ese formato no es de mail';
  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private bd: DatabaseService,
    private _snackBar: MatSnackBar) {
    this.frmDatosPersonales = this.formBuilder.group({
      nombre : new FormControl('', [Validators.required]),
      apellido : new FormControl('', [Validators.required]),
      edad : new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      DNI : new FormControl('', [Validators.required, Validators.pattern(/^\b[\d]{1,3}(\.|\-|\/| )?[\d]{3}(\.|\-|\/| )?[\d]{3}$/),]),
      email : new FormControl('', [Validators.required, Validators.email]),
      clave : new FormControl('', [Validators.required, Validators.minLength(6)]),
      claveRepetida : new FormControl('', [Validators.required, Validators.minLength(6)]),
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
