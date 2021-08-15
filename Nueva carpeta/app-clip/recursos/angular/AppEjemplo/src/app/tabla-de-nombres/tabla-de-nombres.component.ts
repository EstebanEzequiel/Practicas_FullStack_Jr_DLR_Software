import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-de-nombres',
  templateUrl: './tabla-de-nombres.component.html',
  styleUrls: ['./tabla-de-nombres.component.css']
})
export class TablaDeNombresComponent implements OnInit {

  constructor() { 
    this.personas = [];
    this.personas.push(
      {
        nombre:'Joaquin',
        apellido: ' Ruiz',
      },
      {
        nombre:'Alberto',
        apellido: 'Altamirano',
      },
      {
        nombre:'Roberto',
        apellido:'Falcone',
      }
    )
  }

  ngOnInit(): void {
  }
  personas : Persona[];
}
interface Persona{
  nombre : string,
  apellido : string
}