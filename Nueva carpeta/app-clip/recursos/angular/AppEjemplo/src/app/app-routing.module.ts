import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home-component/home-component';
import { TablaDeNombresComponent } from './tabla-de-nombres/tabla-de-nombres.component';

const routes: Routes = [
  {path:'app',component:AppComponent , children:[
    {path:"",component :HomeComponent},
    {path:'tabla',component:TablaDeNombresComponent},
    
  ]},
  {path:'**',redirectTo:'app'}
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
