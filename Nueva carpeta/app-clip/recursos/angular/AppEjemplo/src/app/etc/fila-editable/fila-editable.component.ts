import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'fila-editable',
  templateUrl: './fila-editable.component.html',
  styleUrls: ['./fila-editable.component.css'],
})
export class FilaEditableComponent implements OnInit {
  @Input()fila : any;
  constructor() { }

  ngOnInit(): void {

  }

}
