import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.scss'
})
export class TurnosComponent {
  constructor(protected auth: AuthService){

  }
}
