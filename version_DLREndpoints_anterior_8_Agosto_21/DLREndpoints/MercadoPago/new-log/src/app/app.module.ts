import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { OkComponent } from './components/ok/ok.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OkComponent
  ],
  imports: [
    
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [FormsModule, ReactiveFormsModule, {provide:LocationStrategy,useClass:HashLocationStrategy}],

  bootstrap: [AppComponent]
})
export class AppModule { }
