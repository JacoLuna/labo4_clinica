import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone: true
})
export class ResaltarDirective {
  @Input() appHighlight : string = '';

  // Podemos recibir datos por @Input() →  [appHighlight]="'dato'"   (noten las comillas simples dentro de las dobles. ¿Qué pasa si no las pongo?)

  // Con ElementRef podemos acceder directamente al elemento del DOM que contiene nuestra directiva y modificar distintos atributos.
  // Algo similar a hacer un getElementById(). Más info en → https://angular.io/api/core/ElementRef
  constructor(private el: ElementRef) {}

  // Con @HostListener podemos acceder a eventos del DOM, más info en → https://angular.io/api/core/HostListener
  @HostListener('mouseenter') onMouseEnter() {
    // En este ejemplo, tomamos el valor color del estilo del elemento y lo reemplazamos por appHighligh o (||) "red" en caso de que llegue vacío.
    this.el.nativeElement.style.color = this.appHighlight || 'red';
  }

  // Tarea: Modificar el código para que reciba por input un valor al que vuelva el color cuando se sale el mouse o dejar #000 como default.
  @HostListener('mouseleave') onMouseExit() {
    this.el.nativeElement.style.color = '#000';
  }
}
