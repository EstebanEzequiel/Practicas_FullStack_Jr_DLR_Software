import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class Nombres2Service {
  constructor(private router: Router, private httpClient : HttpClient){
    this.info = [
      'alberto','roberto'
    ]
  }

cambiarnmbre(){
this.info = ['Jair Bolsonaro', 'Alberto Fernanderz']
}

subirnombre(value: any) {
  this.info.unshift(value);
  this.router.navigate(['app/tabla']);
}


subirnombre2(dato: string) {
  let params = new HttpParams();
  params= params.append('id','0');

  this.putGenerico(params,'endpoints',{alberto:'alberto'}).subscribe(data=>{
    console.log('salgo primero');
    
  });

  this.postGenerico('http://localhost:3000/test/',{
    nombre:dato,
    alberto:'alberto',

  }).subscribe(data=>{
    console.log('salgo primero');
    
  },err=>{
    throw err;
  });
  console.log('salgo al ultimo');
  
}




 //http
 postGenerico(url : string, body : object): Observable<any>{
  return this.httpClient.post<any>(url,body)
}

getGenerico( params : HttpParams , ruta :string) : Observable<any>{                                   //endpoints
  return this.httpClient.get<any>(environment.url+environment.api+ruta,{params:params});
}

putGenerico( params : HttpParams , ruta :string,body:object) : Observable<any>{ 
  return this.httpClient.put<any>(ruta,body,{params:params})
}

info: string[];

}
