import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const ssUser = sessionStorage.getItem('usuario');
  return JSON.parse(ssUser!).tipoUsuario == "administrador" || JSON.parse(ssUser!).tipoUsuario == "admin";
};
