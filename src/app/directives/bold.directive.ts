import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBold]',
  standalone: true
})
export class BoldDirective {
  @Input() appHighlight : string = '';
  constructor(private el: ElementRef) {}
  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.fontWeight   = '900';
  }@HostListener('mouseleave') onMouseExit() {
    this.el.nativeElement.style.fontWeight   = '';
  }
}
