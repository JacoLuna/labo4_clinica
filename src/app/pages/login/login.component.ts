import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatButtonModule,MatStepperModule,FormsModule,ReactiveFormsModule,MatIcon,MatProgressSpinnerModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class LoginComponent {
  frmLogin: FormGroup;
  correo = new FormControl('', [Validators.email]);
  clave = new FormControl('', [Validators.minLength(6)]);
  emailErrorMessage = '';
  claveErrorMessage = '';
  hide = true;
  cargando: boolean = true;
  accesosRapido = [{
    img :"https://firebasestorage.googleapis.com/v0/b/lab4lunajaco.appspot.com/o/imagenes%2Fpacientes%2Favatar-admin1-perez-11111111?alt=media&token=57f39c64-2558-4fb1-92fa-81fc60f0c27a",
    email :'admin1@gmail.com',
    clave : 'admin1',
    },
    {
    img : "https://firebasestorage.googleapis.com/v0/b/lab4lunajaco.appspot.com/o/imagenes%2Fespecialistas%2Fperfil-Roberto-Carlos-32145678?alt=media&token=09f50fcd-3bf9-4509-a655-aa6201bf54bb",
    email : 'roberto@gmail.com',
    clave : 'especialista',
    },
    {
    img :"https://firebasestorage.googleapis.com/v0/b/lab4lunajaco.appspot.com/o/imagenes%2Fespecialistas%2Fperfil-juan-Vazques-41123678?alt=media&token=02e130d5-d4c8-4da4-bf82-f5bb3df184d5",
    email :'juanvasquez@gmail.com',
    clave : 'especialista',
    },
    {
    img : "https://firebasestorage.googleapis.com/v0/b/lab4lunajaco.appspot.com/o/imagenes%2Fpacientes%2Favatar-Marcos-Laporte-41628819?alt=media&token=9034e323-a20a-47d9-acca-17c99f5dc462",
    email : 'marcos@gmail.com',
    clave : 'paciente',
    },
    {
    img : "https://firebasestorage.googleapis.com/v0/b/lab4lunajaco.appspot.com/o/imagenes%2Fpacientes%2Favatar-kevin-veliz-40328819?alt=media&token=174ab3ba-b41a-4c85-94a5-bcd804955dae",
    email : "kevin@gmail.com",
    clave : 'paciente',
    },
    {
    img : "https://firebasestorage.googleapis.com/v0/b/lab4lunajaco.appspot.com/o/imagenes%2Fpacientes%2Favatar-Yober-Marlow-17367299?alt=media&token=f57a688a-9528-4dd4-a043-87c6299256ca"
,
    email : 'yober@gmail.com',
    clave : 'paciente',
      }];
   
  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private bd: DatabaseService
  ) {
    this.frmLogin = this.formBuilder.group({
      correo: this.correo,
      clave: this.clave,
    });
    this.cargando = false;
  }
  updateErrorMessage(frmControl: FormControl) {
    if (frmControl.hasError('required')) {
      if (frmControl == this.correo) {
        this.emailErrorMessage = 'este campo es obligatorio';
      } else {
        this.claveErrorMessage = 'este campo es obligatorio';
      }
    } else if (frmControl.hasError('email')) {
      this.emailErrorMessage = 'el formato es incorrecto';
    } else if (frmControl.hasError('minlength')) {
      this.claveErrorMessage = 'se requiere un minimo de 6 caracteres';
    }
  }
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
  login() {
    this.cargando = true;
    this.bd.buscarPersonaPorCorreo(this.correo.value!).then((p) => {
      this.auth
        .ingresarFireAuth(this.correo.value!, this.clave.value!)
        .then(() => {
          this.router.navigate(['/home']);
          this.cargando = false;
        });
    });
  }
  completarCampos(correo: string, clave: string) {
    this.correo.setValue(correo);
    this.clave.setValue(clave);
  }
}
