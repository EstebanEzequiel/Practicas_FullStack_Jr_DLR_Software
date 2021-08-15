import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 

import {LoginComponent} from './login/login.component';
import {RecoveryPassComponent} from './recovery-pass/recovery-pass.component';
import {SingUPComponent} from './sing-up/sing-up.component'
import { AccesomainComponent } from './accesomain.component';

const routes: Routes = [
  {path :'' , component : AccesomainComponent , children : [
    {path :'login', component : LoginComponent },
    {path :'resetpass', component : RecoveryPassComponent},
    {path : 'sing-in', component: SingUPComponent},
   {path : '**',redirectTo : 'login'} 
  ]},
 
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccesoRoutingModule { }