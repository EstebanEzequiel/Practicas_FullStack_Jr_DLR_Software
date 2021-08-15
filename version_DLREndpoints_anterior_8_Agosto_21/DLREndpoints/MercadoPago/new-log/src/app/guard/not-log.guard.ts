import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiciosService } from './../service/servicios.service';

@Injectable({
  providedIn: 'root'
})

export class NotLogGuard implements CanActivate {

  constructor(private serv: ServiciosService, private router: Router){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      let islogged = JSON.parse(localStorage.getItem('username'))

      if (islogged != null) {
        
        if (this.serv.isLogged() || islogged['login']) {
          return true;
        }        
      }

      this.router.navigate(['/login'], { queryParams: { returnUrl: 'app' }});
      return false;
  }
}
