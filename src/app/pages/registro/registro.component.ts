import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Rutas, StorageService } from '../../services/storage.service';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormDatosPersonalesComponent } from '../../components/form-datos-personales/form-datos-personales.component';
import { Persona } from '../../classes/persona';
import { Paciente } from '../../classes/paciente';
import { FormDatosEspecificosComponent, especialidad } from '../../components/form-datos-especificos/form-datos-especificos.component';
import { Especialista } from '../../classes/especialista';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
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
    AsyncPipe,
    MatTabsModule,
    FormDatosPersonalesComponent,
    FormDatosEspecificosComponent,
    CommonModule,
  ],
})
export class RegistroComponent implements OnInit {
  @ViewChild('stepperPaciente') private stepperPaciente!: MatStepper;
  @ViewChild('stepperEspecialista') private stepperEspecialista!: MatStepper;

  protected duration: string = '1000';

  firstLoad = false;

  frmDatosPersonales!: FormGroup;
  urlPerfil: string = '';
  urlAvatar: string = '';

  pacienteStep: number = 0;
  especialistaStep: number = 0;

  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: StorageService,
    private bd: DatabaseService,
    private snackBar: SnackBarService
  ) {}
  ngOnInit(): void {}

  registrarPersona(frmDatosEspecificos: FormGroup, paciente: boolean) {
    let persona: Persona;
    let espExiste: boolean = false;
    if (frmDatosEspecificos.valid) {
      if (paciente) {
        persona = new Paciente(
          '',
          this.frmDatosPersonales.controls['nombre'].value,
          this.frmDatosPersonales.controls['apellido'].value,
          Number(this.frmDatosPersonales.controls['DNI'].value),
          Number(this.frmDatosPersonales.controls['edad'].value),
          [this.urlAvatar, this.urlPerfil],
          this.frmDatosPersonales.controls['email'].value,
          frmDatosEspecificos.controls['obraSocial'].value.nombre
        );
      } else {
        persona = new Especialista(
          '',
          this.frmDatosPersonales.controls['nombre'].value,
          this.frmDatosPersonales.controls['apellido'].value,
          Number(this.frmDatosPersonales.controls['DNI'].value),
          Number(this.frmDatosPersonales.controls['edad'].value),
          this.urlPerfil,
          this.frmDatosPersonales.controls['email'].value,
          frmDatosEspecificos.controls['especialidad'].value.nombre
        );
      }

      if (paciente) {
        this.bd.subirDoc(Colecciones.Pacientes, persona).then(() => {
          console.log('se creó al paciente');
        });
      } else {
        this.bd.subirDoc(Colecciones.Especialistas, persona).then(() => {
          console.log('se creó al especialista');
        });
      }
      this.auth.registrarFireAuth(
        persona,
        this.frmDatosPersonales.controls['clave'].value
      );
      this.snackBar.succesSnackBar("se creó al " + (paciente?'paciente':'especialista') + " con exito!!", "Ok", 2000);
      this.router.navigate(['/home']);
    }
  }

  stepperNext(frm: FormGroup, categoria: string) {
    if (frm.valid) {
      this.frmDatosPersonales = frm;
      if (categoria == 'paciente') {
        this.stepperPaciente.next();
        this.pacienteStep = 1;
      } else {
        this.stepperEspecialista.next();
        this.especialistaStep = 1;
      }
    }
  }
  stepperPrevious(categoria: string) {
    if (categoria == 'paciente') {
      this.stepperPaciente.previous();
      this.pacienteStep = 0;
    } else {
      this.stepperEspecialista.next();
      this.especialistaStep = 0;
    }
  }
  handlePic(file: File, tipoFoto: string, paciente: boolean) {
    this.storage
      .subirArchivo(
        file,
        paciente ? Rutas.Pacientes : Rutas.Especialistas,
        `${tipoFoto}-${this.frmDatosPersonales.controls['nombre'].value}-${this.frmDatosPersonales.controls['apellido'].value}-${this.frmDatosPersonales.controls['DNI'].value}`
      )
      .then((r) => {
        if (tipoFoto == 'avatar') {
          this.urlAvatar = r;
        } else {
          this.urlPerfil = r;
        }
      });
  }

}
