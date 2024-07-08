import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { Especialista } from '../classes/personas/especialista';

export const authorizedGuard: CanActivateFn = (route, state) => {
  const ssUser = sessionStorage.getItem('usuario');
  return JSON.parse(ssUser!).autorizado;
};
