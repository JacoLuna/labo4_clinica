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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }}]
})
export class LoginComponent {
  frmLogin: FormGroup;
  correo = new FormControl('', [Validators.email]);
  clave = new FormControl('', [Validators.minLength(6)]);
  emailErrorMessage = '';
  claveErrorMessage = '';
  hide = true;

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
    this.bd.buscarPersonaPorCorreo(this.correo.value!).then( p => {
      console.log(p);
      this.auth
        .ingresarFireAuth(this.correo.value!, this.clave.value!, p.tipoUsuario)
        .then(() => {
          this.router.navigate(['/home']);
        });
    });
  }
  admin(){
    this.correo.setValue('admin@gmail.com');
    this.clave.setValue('admin1');
  }
}
