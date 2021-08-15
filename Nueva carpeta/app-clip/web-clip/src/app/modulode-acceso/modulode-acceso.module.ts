import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RecoveryPassComponent } from './recovery-pass/recovery-pass.component';
import { SingUPComponent } from './sing-up/sing-up.component';
import { AccesoRoutingModule } from './acceso-routing';
import {AccesomainComponent} from './accesomain.component'



@NgModule({
  declarations: [
    AccesomainComponent,
    LoginComponent,
     RecoveryPassComponent,
      SingUPComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccesoRoutingModule,
  ]
})
export class ModulodeAccesoModule { }
