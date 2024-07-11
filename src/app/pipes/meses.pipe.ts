import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meses',
  standalone: true
})
export class MesesPipe implements PipeTransform {

  transform(value: any): string {
    let dia: string = value.toString();
    switch (dia) {
      case '1':
        return 'Febrero';
      case '2':
        return 'Marzo';
      case '3':
        return 'Abril';
      case '4':
        return 'Mayo';
      case '5':
        return 'Junio';
      case '6':
        return 'Julio';
      case '0':
        return 'Agosto';
      case '1':
        return 'Septiembre';
      case '2':
        return 'Octubre';
      case '3':
        return 'Noviembre';
      case '4':
        return 'Diciembre';
      case '0':
        return 'Enero';
      default:
        return '';
    }
  }

}
