import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OkComponent } from './components/ok/ok.component';
import { LoginComponent } from './components/login/login.component';
import { NotLogGuard } from './guard/not-log.guard';


const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'app', children:[
    {path: 'home', component: OkComponent, canActivate:[NotLogGuard]},
    {path:'',redirectTo : 'home',pathMatch:'full'},
  ]},
  {path: '**', redirectTo: 'app', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
