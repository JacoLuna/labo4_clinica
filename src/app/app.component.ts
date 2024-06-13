import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  showFiller = false;

  constructor(private router: Router, public auth: AuthService) {
    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;
  }
  ngOnInit(): void {
    // this.router.navigate(['/home']);
  }

  logOut() {
    this.auth.signOut();
  }
  registrarEspecialista() {
    this.router.navigate(['/registrarse'], {
      queryParams: { categoria: 'especialista' },
    });
  }
  registrarPaciente() {
    this.router.navigate(['/registrarse'], {
      queryParams: { categoria: 'paciente' },
    });
  }
}
