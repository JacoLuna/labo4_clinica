import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const ssUser = sessionStorage.getItem('usuario');
  let admin: boolean = false; 
  if(JSON.parse(ssUser!).tipoUsuario == "administrador" || JSON.parse(ssUser!).tipoUsuario == "admin"){
    admin = true;
  }
  return admin;
};
