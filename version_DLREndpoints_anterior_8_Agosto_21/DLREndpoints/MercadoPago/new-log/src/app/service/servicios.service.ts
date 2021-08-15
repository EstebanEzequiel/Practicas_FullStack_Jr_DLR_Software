import { Usuario } from './../model/usuario';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as hash from 'hash.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ServiciosService {

  private login: boolean;
  private user: string; 
  private url:string;

  constructor(private http: HttpClient, private router: Router) {

    this.login = false; 
    this.url=''
   }

  public postUsuario(usuario: Usuario): Observable<any> {

    let nonce = Date.now();
    let firstHash = hash.sha256().update(usuario.user.toLowerCase() + ' ' + usuario.password).digest('hex');
    let secondHash = hash.sha256().update(nonce + ' ' + firstHash).digest('hex');

    return this.http.post<any>(this.url, { usuario: usuario.user, hash: secondHash, nonce: nonce });
  }

  start() {
    this.getJSON();
  }

  async getJSON()  {

    let response = await this.http.get('../../assets/config.json').toPromise();
    console.log(response);
    this.url = response['endpoint'] + response['path']
    console.log(this.url);
  }

  setLogged(log: boolean){
    this.login = log;
  }

  isLogged(): boolean {
    return this.login;
  }
  
  setUser(usuario: string, response: any ){
    
    localStorage.setItem('username', JSON.stringify({ user: usuario, token: response.token }));
    console.log(response.token);
    
    this.user = usuario;
  }
  
  outUser(){
    localStorage.removeItem('username');
    location.reload();
  }

  goToHome() {
    this.router.navigateByUrl('app/home');
  }
}
