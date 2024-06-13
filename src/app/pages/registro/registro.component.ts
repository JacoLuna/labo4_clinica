import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { Rutas, StorageService } from '../../services/storage.service';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { Persona } from '../../classes/persona';
import { Paciente } from '../../classes/paciente';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { Especialista } from '../../classes/especialista';

export interface especialidad {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-registro',
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
    AsyncPipe,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit {
  protected duration: string = '1000';

  frmRegister!: FormGroup;
  nombre = new FormControl('');
  apellido = new FormControl('');
  edad = new FormControl('');
  DNI = new FormControl('');
  email = new FormControl('', [Validators.email]);
  clave = new FormControl('', [Validators.minLength(6)]);
  claveRepetida = new FormControl('', [Validators.minLength(6)]);
  fotoAvatar = new FormControl('');
  fotoPerfil = new FormControl('');
  especialidad = new FormControl<string | especialidad>('');

  nombreErrorMessage: string = '';
  apellidoErrorMessage: string = '';
  edadErrorMessage: string = '';
  DNIErrorMessage: string = '';
  emailErrorMessage: string = '';
  claveErrorMessage: string = '';
  claveRepetidaErrorMessage: string = '';

  imgPerfil!: File;
  imgAvatar!: File;
  urlPerfil: string = '';
  urlAvatar: string = '';
  categoria!: string;
  filteredOptions!: Observable<especialidad[]>;
  options: especialidad[] = [];

  firstLoad = false;
  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: StorageService,
    private bd: DatabaseService
  ) {
    bd.traerColeccion<especialidad>(Colecciones.Especialidades).then((r) => {
      this.options = r;
    });
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.cargar(params);
      if (
        this.router.getCurrentNavigation()?.trigger === 'imperative' ||
        !this.firstLoad
      ) {
        this.firstLoad = true;
        this.cargar(params);
        // this.dontCallNgOninit = true;
      }
      // else {
      //   // this.router.navigate(['/registrarse']);
      // }
    });
    // if(!this.dontCallNgOninit){
    //   this.cargar();
    // }
  }

  cargar(params: Params) {
    this.categoria = params['categoria'];
    if (this.categoria == 'paciente') {
      this.frmRegister = this.formBuilder.group({
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        DNI: this.DNI,
        email: this.email,
        clave: this.clave,
        claveRepetida: this.claveRepetida,
        fotoAvatar: this.fotoAvatar,
        fotoPerfil: this.fotoPerfil,
      });
    } else {
      this.frmRegister = this.formBuilder.group({
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        DNI: this.DNI,
        email: this.email,
        clave: this.clave,
        claveRepetida: this.claveRepetida,
        fotoPerfil: this.fotoPerfil,
        especialidad: this.especialidad,
      });
    }

    this.filteredOptions = this.especialidad.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre ? this._filter(nombre as string) : this.options.slice();
      })
    );
  }
  displayFn(especialidad: especialidad): string {
    return especialidad && especialidad.nombre ? especialidad.nombre : '';
  }
  private _filter(nombre: string): especialidad[] {
    const filterValue = nombre.toLowerCase();
    return this.options.filter((option) => {
      return option.nombre.toLowerCase().includes(filterValue);
    });
  }

  updateErrorMessage(frmControl: FormControl) {
    if (frmControl.hasError('required')) {
      if (frmControl == this.nombre) {
        this.nombreErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.apellido) {
        this.apellidoErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.edad) {
        this.edadErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.DNI) {
        this.DNIErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.email) {
        this.emailErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.clave) {
        this.claveErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.claveRepetida) {
        this.claveRepetidaErrorMessage = 'este campo es obligatorio';
      }
    } else if (frmControl.hasError('email')) {
      // this.emailErrorMessage = 'el formato es incorrecto';
    } else if (frmControl.hasError('minlength')) {
      // this.claveErrorMessage = 'se requiere un minimo de 6 caracteres';
    }
  }

  fillFields() {
    this.nombre.setValue('juan');
    this.apellido.setValue('perez');
    this.edad.setValue('22');
    this.DNI.setValue('12345678');
    this.email.setValue('email@gmail.com');
    this.clave.setValue('123456');
    this.claveRepetida.setValue('123456');
  }

  onAvatarSelected($event: any) {
    if ($event.target.files.length > 0) {
      this.imgAvatar = $event.target.files[0];
      this.storage
        .subirArchivo(
          this.imgAvatar,
          Rutas.Pacientes,
          `avatar-${this.nombre.value}-${this.apellido.value}-${this.DNI.value}`
        )
        .then((r) => {
          this.urlAvatar = r;
        });
    }
  }

  onPerfilSelected($event: any) {
    if ($event.target.files.length > 0) {
      this.imgPerfil = $event.target.files[0];
      this.storage
        .subirArchivo(
          this.imgPerfil,
          this.categoria == 'paciente' ? Rutas.Pacientes : Rutas.Especialistas,
          `perfil-${this.nombre.value}-${this.apellido.value}-${this.DNI.value}`
        )
        .then((r) => {
          this.urlPerfil = r;
        });
    }
  }
  registrarPersona() {
    let persona: Persona;
    let especialidadElegida: string = '';

    if (this.categoria == 'paciente') {
      persona = new Paciente(
        '',
        this.nombre.value!,
        this.apellido.value!,
        Number(this.DNI.value!),
        Number(this.edad.value!),
        [this.urlAvatar, this.urlPerfil],
        this.email.value!
      );
      // this.bd.subirDoc(Colecciones.Pacientes, persona).then(() => {
      //   console.log('se creó al paciente');
      // });
    } else {
      this.options.forEach((o) => {
        if (this.especialidad.value == o) {
          especialidadElegida = o.nombre;
        }
      });

      persona = new Especialista(
        '',
        this.nombre.value!,
        this.apellido.value!,
        Number(this.DNI.value!),
        Number(this.edad.value!),
        this.urlPerfil,
        this.email.value!,
        especialidadElegida
      );
    }
    this.bd.subirDoc(Colecciones.Personas, persona).then(() => {
      if (this.categoria == 'especialista') {
        this.bd.subirDoc(Colecciones.Especialistas, persona).then(() => {
          console.log('se creó al especialista');
        });
      }
      console.log('se creó al paciente');
      this.auth.registrarFireAuth(persona, this.clave.value!);
      this.router.navigate(['/home']);
    });
  }
}
