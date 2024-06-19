import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService{
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    action: string,
    duracion?: number,
    posicion: MatSnackBarVerticalPosition = 'bottom'
  ) {
    if (duracion) {
      this._snackBar
        .open(message, action, {
          verticalPosition: posicion,
        })
        ._dismissAfter(duracion);
    } else {
      this._snackBar.open(message, action, {
        verticalPosition: posicion,
      });
    }
  }
  succesSnackBar(
    message: string,
    action: string,
    duracion?: number,
    posicion: MatSnackBarVerticalPosition = 'bottom'
  ) {
    this.openSnackBar(message, action, duracion, posicion);
  }
}
