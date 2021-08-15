import { Directive, ElementRef, Input, Renderer2, ViewChildren} from '@angular/core';

@Directive({
  selector: '[MyDirective]'
})
export class MyDirectiveDirective {
  // @ViewChildren()inputs : Input
  @Input()nombre : string;
  constructor(private el: ElementRef,private render : Renderer2) { 
      this.nombre = this.nombre || 'SinNombre';
      
    //this.render.addClass(this.el.nativeElement,'red');
    this.render.setStyle(el.nativeElement,'background','red');
    console.log(this.nombre);


  }
}
