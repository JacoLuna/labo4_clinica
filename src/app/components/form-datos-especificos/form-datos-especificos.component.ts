import { Component, EventEmitter, Output, Input, inject, computed, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { FormDatosPersonalesComponent } from '../../components/form-datos-personales/form-datos-personales.component';
import { AuthService } from '../../services/auth.service';
import { Colecciones, DatabaseService } from '../../services/database.service';
import { startWith, map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackBarService } from '../../services/snack-bar.service';
import { MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER} from '@angular/cdk/keycodes';
import { Especialidad } from '../../classes/especialidad';
import { ObraSocial } from '../../classes/obraSocial';
import { RecaptchaModule } from 'ng-recaptcha';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-form-datos-especificos',
  standalone: true,
  imports: [ MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, MatCardModule, MatAutocompleteModule, AsyncPipe, FormDatosPersonalesComponent, MatTabsModule, MatTooltipModule, MatChipsModule, RecaptchaModule],
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
  frmDatosEspecificosAdmin!: FormGroup;
  
  errrorCampoObligatorio = 'Este campo es obligatorio';
  filteredObrasSociales!: Observable<ObraSocial[]>;
  filteredEspecialidades!: Observable<Especialidad[]>;
  
  optionsObraSocial: ObraSocial[] = [];
  optionsEspecialidad: Especialidad[] = [];

  imgPerfil!: File;
  imgAvatar!: File;
  urlPerfil: string = '';
  urlAvatar: string = '';
  picPerfilCanceled: boolean = false;
  picAvatarCanceled: boolean = false;
  
  recaptcha: boolean = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentEspecialidad = model('');
  readonly especialidades = signal<string[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  constructor( public auth: AuthService, private formBuilder: FormBuilder, private bd: DatabaseService, private dialog: MatDialog, private snackBar: SnackBarService) {
    this.frmDatosEspecificosPaciente = this.formBuilder.group({
      fotoAvatar: new FormControl('', [Validators.required]),
      fotoPerfil: new FormControl('', [Validators.required]),
      obraSocial: new FormControl<string | ObraSocial>('', [Validators.required]),
    });
    this.frmDatosEspecificosEspecialista = this.formBuilder.group({
      fotoPerfil: new FormControl('', [Validators.required]),
      especialidades: new FormControl([], [Validators.required]),
    });
    this.frmDatosEspecificosAdmin = this.formBuilder.group({
      fotoPerfil: new FormControl('', [Validators.required]),
    });
    
    this.bd.traerColeccion<ObraSocial>(Colecciones.ObrasSociales).then((r) => {
      this.optionsObraSocial = r;
    });

    this.bd.traerColeccion<Especialidad>(Colecciones.Especialidades).then((r) => {
      this.optionsEspecialidad = r;
    });
    this.filteredObrasSociales = this.frmDatosEspecificosPaciente.controls['obraSocial'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre
          ? this._filterObraSocial(nombre as string)
          : this.optionsObraSocial.slice();
      })
    );
    
    this.filteredEspecialidades = this.frmDatosEspecificosEspecialista.controls['especialidades'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre
          ? this._filterEspecialidad(nombre as string)
          : this.optionsEspecialidad.slice();
      })
    );
  }

  displayFn(objeto: ObraSocial | Especialidad): string {
    return objeto && objeto.nombre ? objeto.nombre : '';
  }
  private _filterObraSocial(nombre: string): ObraSocial[]{
    const filterValue = nombre.toLowerCase();
    return this.optionsObraSocial.filter((option) => {
      return option.nombre.toLowerCase().includes(filterValue);
    });
  }
  private _filterEspecialidad(nombre: string): Especialidad[] {
    const filterValue = nombre.toLowerCase();
    return this.optionsEspecialidad.filter((option) => {
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
    let espExiste = false;
    if(
      this.categoria == 'admin' &&
      this.frmDatosEspecificosAdmin.controls['fotoPerfil'].value != ""
      ||
      this.categoria == 'especialista' && 
      this.frmDatosEspecificosEspecialista.controls['fotoPerfil'].value != ""
        ||
      this.frmDatosEspecificosPaciente.controls['fotoPerfil'].value != "" && 
      this.frmDatosEspecificosPaciente.controls['fotoAvatar'].value != ""){
      
      if (this.categoria == 'paciente'){
        this.onNextEvent.emit(this.frmDatosEspecificosPaciente);
      }else if(this.categoria == 'especialista'){
        this.onNextEvent.emit(this.frmDatosEspecificosEspecialista);
      }else {
        this.onNextEvent.emit(this.frmDatosEspecificosAdmin);
      }
      
    }else{
      if(this.categoria == 'paciente' ){
        if(this.frmDatosEspecificosPaciente.controls['fotoAvatar'].value == ""){
        this.frmDatosEspecificosPaciente.controls['fotoAvatar'].setErrors({'invalid': true});
        }
        if(this.frmDatosEspecificosPaciente.controls['fotoPerfil'].value == ""){
          this.frmDatosEspecificosPaciente.controls['fotoPerfil'].setErrors({'invalid': true});
        }
      }else if(this.categoria == 'especialista' ){
        if(this.frmDatosEspecificosEspecialista.controls['fotoPerfil'].value == ""){
          this.frmDatosEspecificosEspecialista.controls['fotoPerfil'].setErrors({'invalid': true});
        }
      }else{
        if(this.frmDatosEspecificosAdmin.controls['fotoPerfil'].value == ""){
          this.frmDatosEspecificosAdmin.controls['fotoPerfil'].setErrors({'invalid': true});
        }
      }
    }

  }
  anterior() {
    this.onPreviousEvent.emit();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().split(' ')[0];
    if (value) {
      this.especialidades.update(especialidades => [...especialidades, value]);
    }
    this.currentEspecialidad.set('');
  }

  remove(especialidad: string): void {
    this.especialidades.update(especialidades => {
      const index = especialidades.indexOf(especialidad);
      if (index < 0) {
        return especialidades;
      }
      especialidades.splice(index, 1);
      this.announcer.announce(`Removed ${especialidad}`);
      return [...especialidades];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.especialidades.update(especialidades => [...especialidades, event.option.viewValue]);
    this.currentEspecialidad.set('');
    this.frmDatosEspecificosEspecialista.controls['especialidades'].setValue(this.especialidades());
  }

  resolved(captchaResponse: string | null) {
    this.recaptcha = true;
  }
}
