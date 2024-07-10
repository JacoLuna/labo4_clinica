import { CanActivateFn } from '@angular/router';

export const authorizedGuard: CanActivateFn = (route, state) => {
  const ssUser = sessionStorage.getItem('usuario');
  return JSON.parse(ssUser!).autorizado;
};
