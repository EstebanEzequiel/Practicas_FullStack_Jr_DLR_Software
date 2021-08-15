import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../acceso.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private serv : AccesoService) { }

  ngOnInit(): void {
    console.log(this.serv.info);

  }

}
