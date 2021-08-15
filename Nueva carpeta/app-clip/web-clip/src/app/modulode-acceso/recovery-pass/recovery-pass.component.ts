import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.component.html',
  styleUrls: ['./recovery-pass.component.css']
})
export class RecoveryPassComponent implements OnInit {
  // [(ngModel)]="name" 
  constructor() { 
    this.name="";
  }
  ngOnInit(): void {
    console.log('se incio elcompom');
    
  }
  cuandocambia(){
   console.log(this.name);
   
  }
  hiceunclick(){
    console.log(this.name);
    
  }

  name : string;
}
