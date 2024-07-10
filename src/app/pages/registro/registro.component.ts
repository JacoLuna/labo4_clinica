import { AfterViewInit, Component, Input, OnInit, ViewChild,} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup,} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Rutas, StorageService } from '../../services/storage.service';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormDatosPersonalesComponent } from '../../components/form-datos-personales/form-datos-personales.component';
import { Persona } from '../../classes/personas/persona';
import { Paciente } from '../../classes/personas/paciente';
import { FormDatosEspecificosComponent } from '../../components/form-datos-especificos/form-datos-especificos.component';
import { Especialista } from '../../classes/personas/especialista';
import { SnackBarService } from '../../services/snack-bar.service';
import { Admin } from '../../classes/personas/admin';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Especialidad } from '../../classes/especialidad';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
  imports: [ MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, MatCardModule, MatAutocompleteModule, AsyncPipe, MatTabsModule, FormDatosPersonalesComponent, FormDatosEspecificosComponent, CommonModule, MatProgressSpinnerModule],
})
export class RegistroComponent implements OnInit {
  @Input() admin: boolean = false;
  @ViewChild('stepperPaciente') private stepperPaciente!: MatStepper;
  @ViewChild('stepperEspecialista') private stepperEspecialista!: MatStepper;
  @ViewChild('stepperAdmin') private stepperAdmin!: MatStepper;
  
  protected duration: string = '1000';
  cargando = false;

  firstLoad = false;

  frmDatosPersonales!: FormGroup;
  urlPerfil: string = '';
  urlAvatar: string = '';

  pacienteStep: number = 0;
  especialistaStep: number = 0;
  adminStep: number = 0;
  

  constructor(
    public auth: AuthService,
    private router: Router,
    private storage: StorageService,
    private db: DatabaseService,
    private snackBar: SnackBarService
  ) {}
  ngOnInit(): void {
  }

  async registrarPersona(frmDatosEspecificos: FormGroup, categoria: string) {
    this.cargando = true;
    let especialidades: Especialidad[] = [];
    let persona: Persona;
    if (frmDatosEspecificos.valid) {
      switch (categoria) {
        case 'paciente':
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
          break;
        case 'especialista':
          persona = new Especialista(
            '',
            this.frmDatosPersonales.controls['nombre'].value,
            this.frmDatosPersonales.controls['apellido'].value,
            Number(this.frmDatosPersonales.controls['DNI'].value),
            Number(this.frmDatosPersonales.controls['edad'].value),
            this.urlPerfil,
            this.frmDatosPersonales.controls['email'].value,
            frmDatosEspecificos.controls['especialidades'].value
          );

          especialidades = await this.db.traerColeccion(Colecciones.Especialidades);

          (<string[]>frmDatosEspecificos.controls['especialidades'].value).forEach(esp => {
            if(!especialidades.find(espescialidad => esp == espescialidad.nombre)){

              this.db.subirDoc(Colecciones.Especialidades, new Especialidad(esp));
            }
          });
          break;
        case 'admin':
          persona = new Admin(
            '',
            this.frmDatosPersonales.controls['nombre'].value,
            this.frmDatosPersonales.controls['apellido'].value,
            Number(this.frmDatosPersonales.controls['DNI'].value),
            Number(this.frmDatosPersonales.controls['edad'].value),
            this.urlPerfil,
            this.frmDatosPersonales.controls['email'].value,
          );
          break;
      }
      await this.auth.registrarFireAuth(persona!, this.frmDatosPersonales.controls['clave'].value);

      switch (categoria) {
        case 'paciente':
          this.snackBar.succesSnackBar(
            'se creó al paciente con exito!!','Ok',
            2000
          );
          break;
        case 'especialista':
          this.snackBar.succesSnackBar(
            'se creó al especialista con exito!!','Ok',
            2000
          );
          break;
        case 'admin':
          this.snackBar.succesSnackBar(
            'se creó al admin con exito!!','Ok',
            2000
          );
          break;
      }
      this.cargando = false;
      if (!this.admin) this.router.navigate(['/home']);
        
    } else {
      this.snackBar.succesSnackBar('hubo un error en algún campo ', 'Ok', 2000);
    }
  }

  stepperNext(frm: FormGroup, categoria: string) {
    if (frm.valid) {
      this.frmDatosPersonales = frm;
      switch (categoria) {
        case 'paciente':
          this.stepperPaciente.next();
          this.pacienteStep = 1;
          break;
        case 'especialista':
          this.stepperEspecialista.next();
          this.especialistaStep = 1;
          break;
        case 'admin':
          this.stepperAdmin.next();
          this.adminStep = 1;
          break;
      }
    }
  }
  stepperPrevious(categoria: string) {
    switch (categoria) {
      case 'paciente':
        this.stepperPaciente.previous();
        this.pacienteStep = 0;
        break;
      case 'especialista':
        this.stepperEspecialista.previous();
        this.especialistaStep = 0;
        break;
      case 'admin':
        this.stepperAdmin.previous();
        this.adminStep = 0;
        break;
    }
  }
  handlePic(file: File, tipoFoto: string, categoria: string) {
    this.cargando = true;
    this.storage
      .subirArchivo(
        file,
        categoria == 'paciente'
          ? Rutas.Pacientes
          : categoria == 'especialista'
          ? Rutas.Especialistas
          : Rutas.Admin,
        `${tipoFoto}-${this.frmDatosPersonales.controls['nombre'].value}-${this.frmDatosPersonales.controls['apellido'].value}-${this.frmDatosPersonales.controls['DNI'].value}`
      )
      .then((r) => {
        if (tipoFoto == 'avatar') {
          this.urlAvatar = r;
        } else {
          this.urlPerfil = r;
        }
        this.cargando = false;
      });
  }
}
