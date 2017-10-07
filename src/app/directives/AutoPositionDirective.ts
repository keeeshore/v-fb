import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[autoPosition]'
})
export class AutoPositionDirective {

  constructor(private el: ElementRef) { }

  @Input() defaultColor: string;

  @Input('autoPosition') highlightColor: string;

  @HostListener('scroll') onMouseEnter() {
    console.log('scroll in autopositiondirective::');
    //this.highlight(this.highlightColor || this.defaultColor || 'red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}