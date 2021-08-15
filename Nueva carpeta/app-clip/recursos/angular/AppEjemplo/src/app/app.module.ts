import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HomeComponent} from './home-component/home-component';
import { CambiaColoreDirective } from './etc/cambia-colore.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablaDeNombresComponent } from './tabla-de-nombres/tabla-de-nombres.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { TablaEditableDirective } from './etc/tabla-editable.directive';
import { FilaEditableComponent } from './etc/fila-editable/fila-editable.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CambiaColoreDirective,
    TablaDeNombresComponent,
    TablaEditableDirective,
    FilaEditableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
