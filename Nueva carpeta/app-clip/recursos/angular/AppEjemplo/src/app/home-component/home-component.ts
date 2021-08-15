import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import {Nombres2Service} from '../servicios/nombres2.service';

@Component({
  selector: 'home-comp',
 /*template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Hello, World!</p>
      <p><button class="btn btn-lg btn-outline-primary" (click)="open()">Launch demo modal</button></p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `*/
  templateUrl: './home-component.html',
})

export class HomeComponent implements OnInit {

  constructor( private serv : Nombres2Service , private formBuilder : FormBuilder ){
    this.infodelerver= this.serv.info;
    this.endpoints=[];
  }
  
  ngOnInit(): void {
    
    console.log(this.infodelerver);//alberto roberto
    this.serv.cambiarnmbre();
    console.log(this.infodelerver);//jari ...alberto
    
    document.getElementById('alberto').innerHTML= this.infodelerver[0];

    this.formanombre = this.formBuilder.group({
     nombre : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]]
    });
    //un negro que escucha
    this.albertonombreAPI.pipe( delay(1000) ).subscribe(informacion=>{
      console.log(informacion);// alberto // alberto2
      
    },err=>{

    },()=>{

    })
    


    let params = new HttpParams();

    this.serv.getGenerico(params,'endpoints').subscribe(data=>{
      console.log(data);
      
     this.endpoints = data as Endpoints[];
      //console.log(this.endpoints);
      
    },err=>{
      console.error(err);
      
    });

    console.log('alberot');
    
  }

  //el negro que habla
  albertonombreAPI = new Observable(sus=>{
    setTimeout(() => {
      sus.next('Alberto')
      setTimeout(() => {
        sus.next('Alberto 2')
        sus.complete();
      }, 5000);
    }, 5000);
  });

  get formFields(){    
    return this.formanombre.controls;
  }


  mostrarnombre(){
    this.serv.subirnombre2(this.nombre);    
  }
   
  
  get valido() : boolean {
    if (this.nombre!=undefined && this.nombre.length>4 ) {
      return true
    } else {
        return false
    }
  }
  nomaximo(valor:string){
  
    
    if (valor.length<7) {
      this.nombre=valor;
    }
    else{
      valor=this.nombre;
    }

  }
  submitForm(){
    this.serv.subirnombre(this.formFields.nombre.value)
    
  }
  
  formanombre : FormGroup;
  nombre : string;
  infodelerver : string[]
  mydata:any;
  endpoints : Endpoints[];
}



interface Endpoints {
  endpoint: string,
  metodo: string,
  seguridad: string,
}