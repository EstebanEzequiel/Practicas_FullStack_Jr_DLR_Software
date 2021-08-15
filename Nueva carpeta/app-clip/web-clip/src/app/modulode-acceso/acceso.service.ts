import { Injectable } from '@angular/core';
import {CreaUsuarioForm} from './etc/sing-up-form.interface'
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AccesoService {
 
  info : CreaUsuarioForm;
  infodeApi : ResultadoApi;

  constructor( private httpClient : HttpClient) {
    this.provedor = new Subject();

    console.log('se inicio el servicio');
    this.inicio()
   }

  inicio(){
    let id =setInterval(() => {
      this.httpClient.get('http://worldclockapi.com/api/json/est/now').subscribe(data=>{
        console.log(data);
        
        console.log(this.infodeApi);

        this.infodeApi=data as ResultadoApi;

        this.provedor.next(this.infodeApi);
        //this.provedor.complete();
        
        
      },err=>{
        console.error(err);
        
      },
      ()=>{
        console.log('completado');
        
      })
    }, 23000);
    
  }
  cuandomevoy(){
    clearInterval()
  }

  subirinformacion(infodecrearus: CreaUsuarioForm) {
    let infodefacebok : number = 0;
    /*
    api facebook
    646548646
    */
    infodecrearus.idFacebook=infodefacebok;
    this.info = infodecrearus;
  }
  

  comoesmiNombre(nombre : string,devolvernombre){
    setTimeout(() => {
      devolvernombre(nombre);
    }, 3000);
  }
  
  getProvedor(){
    return this.provedor.asObservable();
  }
 
  private provedor : Subject<ResultadoApi>;
}
export interface ResultadoApi {
    completed: boolean,
  id: number,
  title: string,
  userId: number,
}