import { ServiciosService } from './../../service/servicios.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ok',
  templateUrl: './ok.component.html',
  styleUrls: ['./ok.component.css']
})
export class OkComponent implements OnInit {

  constructor(private serv: ServiciosService) { }

  ngOnInit(): void { }

  outLog() {
    this.serv.outUser();
  }
}
