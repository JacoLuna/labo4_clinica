import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  Input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { FormDatosPersonalesComponent } from '../../components/form-datos-personales/form-datos-personales.component';
import { AuthService } from '../../services/auth.service';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { startWith, map, Observable } from 'rxjs';

export interface obraSocial {
  id: string;
  nombre: string;
}
export interface especialidad {
  id: string;
  nombre: string;
}


@Component({
  selector: 'app-form-datos-especificos',
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
    FormDatosPersonalesComponent,
    MatTabsModule,
  ],
  templateUrl: './form-datos-especificos.component.html',
  styleUrl: './form-datos-especificos.component.scss',
})
export class FormDatosEspecificosComponent {
  @Output() onPicEvent = new EventEmitter<[file: File, tipoFoto: string, paciente: boolean]>();
  @Output() onNextEvent = new EventEmitter<FormGroup>();
  @Output() onPreviousEvent = new EventEmitter();
  @Input() categoria: string = 'paciente';

  frmDatosEspecificosPaciente!: FormGroup;
  frmDatosEspecificosEspecialista!: FormGroup;
  errrorCampoObligatorio = 'Este campo es obligatorio';
  filteredObrasSociales!: Observable<obraSocial[]>;
  filteredEspecialidades!: Observable<especialidad[]>;
  optionsObraSocial: obraSocial[] = [];
  optionsEspecialidad: especialidad[] = [];
  imgPerfil!: File;
  imgAvatar!: File;
  urlPerfil: string = '';
  urlAvatar: string = '';
  picPerfilCanceled: boolean = false;
  picAvatarCanceled: boolean = false;

  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private bd: DatabaseService
  ) {
    this.frmDatosEspecificosPaciente = this.formBuilder.group({
      fotoAvatar: new FormControl(''),
      fotoPerfil: new FormControl(''),
      obraSocial: new FormControl<string | obraSocial>('', [
        Validators.required,
      ]),
    });
    this.frmDatosEspecificosEspecialista = this.formBuilder.group({
      fotoPerfil: new FormControl(''),
      especialidad: new FormControl<string | obraSocial>('', [
        Validators.required,
      ]),
    });

    this.bd.traerColeccion<obraSocial>(Colecciones.ObrasSociales).then((r) => {
      this.optionsObraSocial = r;
    });
    this.bd
      .traerColeccion<especialidad>(Colecciones.Especialidades)
      .then((r) => {
        this.optionsEspecialidad = r;
      });
    this.filteredObrasSociales = this.frmDatosEspecificosPaciente.controls[
      'obraSocial'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre
          ? this._filter(nombre as string)
          : this.optionsObraSocial.slice();
      })
    );
    this.filteredEspecialidades = this.frmDatosEspecificosEspecialista.controls[
      'especialidad'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre
          ? this._filter(nombre as string)
          : this.optionsEspecialidad.slice();
      })
    );
  }
  displayFn(objeto: obraSocial | especialidad): string {
    return objeto && objeto.nombre ? objeto.nombre : '';
  }
  private _filter(nombre: string): obraSocial[] | especialidad[] {
    const filterValue = nombre.toLowerCase();
    return this.optionsObraSocial.filter((option) => {
      return option.nombre.toLowerCase().includes(filterValue);
    });
  }
  onPerfilSelected($event: any) {
    if ($event.target.files.length > 0) {
      this.imgPerfil = $event.target.files[0];
      this.onPicEvent.emit([this.imgPerfil, 'perfil', true]);
    }
  }
  perfilPicCanceled() {
    this.picPerfilCanceled = true;
  }
  onAvatarSelected($event: any) {
    if ($event.target.files.length > 0) {
      this.imgPerfil = $event.target.files[0];
      this.onPicEvent.emit([this.imgPerfil, 'avatar', true]);
    }
  }
  avatarPicCanceled() {
    this.picAvatarCanceled = true;
  }
  siguiente() {
    if (this.categoria == 'paciente')
      this.onNextEvent.emit(this.frmDatosEspecificosPaciente);
    else this.onNextEvent.emit(this.frmDatosEspecificosEspecialista);
  }
  anterior() {
    this.onPreviousEvent.emit();
  }
}
