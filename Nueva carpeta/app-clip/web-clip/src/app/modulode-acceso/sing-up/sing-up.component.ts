import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AccesoService, ResultadoApi} from '../acceso.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUPComponent implements OnInit {
 
  constructor(private serv : AccesoService,private formBuilder: FormBuilder) { 
    this.serv.getProvedor().subscribe(data=>{
      this.infodelProvedor =data;
    })

  }

  ngOnInit(): void {
    this.singupForm = this.formBuilder.group({
      usuario: [''],
      apellido: [''],    
      correo:[''],        
      password: [''],
    });
    this.ejemplo();
  }
  submitForm(){
    console.log(this.singupForm.getRawValue());
    this.serv.subirinformacion(this.singupForm.getRawValue()) 
  }
  llamarnombre(){
    this.serv.comoesmiNombre('Alberto',this.devolucion);
  }
  ejemplo = () =>{
      let comprarGaseosaarv2 = (preferencia : Alberto) =>{
        console.log('usted compro :' + preferencia.cantidadv2 
        + ' del gusto :'+ preferencia.gustov2);
      }

      let albertitere = new Alberto('coca',2,'2L');

      let alberto2 : Alberto = {gustov2:'coca',cantidadv2:2,presentacion:'2L'};
      /*
      console.log('con instancia');

      comprarGaseosaarv2(albertitere);

      console.log('solo obj');

      comprarGaseosaarv2(alberto2);
      */

      console.log(albertitere.toString());

      console.log(alberto2.toString());

      console.log((3).toString());
  }
  
  
  
  private devolucion(nombre){
    console.log(nombre);
  }
  singupForm: FormGroup;
  infodelProvedor : ResultadoApi;
}

class Persona {
   decirhola()
   {
     console.log('hi');
     
   };
}

class Mateo extends Persona{
  
  constructor(){
    super();
  }

  decirhola() {
    console.log('soy mateo');
  }

}

class Alberto{

  constructor(gusto: string,cantidad: number,presentacion : string){
      
      this.gustov2=gusto;
      this.cantidadv2=cantidad;
      this.presentacion = presentacion;
  }
 
   gustov2:string;
   cantidadv2:number;
   presentacion : string;
  
  toString(){
      return this.gustov2 + this.presentacion;
  }
}
