import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCursiva]',
  standalone: true
})
export class CursivaDirective {
  @Input() appHighlight : string = '';
  constructor(private el: ElementRef) {}
  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.fontStyle  = 'italic';
  }@HostListener('mouseleave') onMouseExit() {
    this.el.nativeElement.style.fontStyle  = '';
  }

}
