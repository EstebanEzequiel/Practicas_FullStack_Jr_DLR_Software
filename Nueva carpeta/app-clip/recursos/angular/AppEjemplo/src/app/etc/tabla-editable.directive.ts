import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[TablaEditable]'
})
export class TablaEditableDirective {

  constructor(private el: ElementRef,private render : Renderer2) { 
    
  }
  
}
