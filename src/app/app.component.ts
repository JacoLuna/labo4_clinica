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
import { DiasPipe } from './pipes/dias.pipe';

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
  dia:string = '';
  currDate: Date = new Date();
  diasPipe = new DiasPipe();
  constructor(private router: Router, public auth: AuthService) {
    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;
  }
  ngOnInit(): void {
    this.dia = this.diasPipe.transform(this.currDate.getDay().toString());
  }

  logOut() {
    this.auth.signOut();
    this.router.navigate(['/home']);
  }
  manageTurnos(){
    this.router.navigate(['/solicitar-turno']);
  }
  manageMisTurnos(){
    this.router.navigate(['/administrar-turno']);  
  }
}
