import { ServiciosService } from './service/servicios.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private serv : ServiciosService){
    
  }
  ngOnInit(): void {

    this.serv.start();
  }
  
  title = 'login';
}
