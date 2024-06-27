import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { authorizedGuard } from './guards/authorized.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'Home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [() => redirectLoggedInTo(['/home'])],
  },
  {
    path: 'registrarse',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(
        (m) => m.RegistroComponent
      ),
      canActivate: [() => redirectLoggedInTo(['/home'])],
  },
  {
    path: 'administrar-usuarios',
    loadComponent: () =>
      import(
        './pages/administrar-usuarios/administrar-usuarios.component'
      ).then((m) => m.AdministrarUsuariosComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/mi-perfil/mi-perfil.component').then((m) => m.MiPerfilComponent),
    canActivate: [() => redirectUnauthorizedTo(['/home'])],
  },
  {
    path: 'solicitar-turno',
    loadComponent: () =>
      import('./pages/solicitar-turnos/solicitar-turnos.component').then((m) => m.SolicitarTurnosComponent),
      canActivate: [() => redirectUnauthorizedTo(['/home'])],
  },
  { path: '**', component: HomeComponent },
];
