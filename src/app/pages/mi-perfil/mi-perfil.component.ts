import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Especialista } from '../../classes/especialista';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatInput, MatInputModule, MatListModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss',
})
export class MiPerfilComponent {
  especialista!: Especialista;
  constructor(protected auth: AuthService) {
    if(auth.UsuarioEnSesion?.tipoUsuario == 'especialista'){
      this.especialista = <Especialista>auth.UsuarioEnSesion;
    }
  }
}
