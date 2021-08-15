import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  dataField:Endpoint[]

  constructor(){
    this.dataField = [
      {endpoint:'', method:'', security:'', table:'', properties:[] }
    ]
   }

  editField: string;

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.personList[id][property] = editField;
  }

  remove(id: any) {
    this.awaitingPersonList.push(this.personList[id]);
    this.personList.splice(id, 1);
  }

  add() {
    if (this.awaitingPersonList.length >= 0) {
      const person = this.awaitingPersonList[0];
      this.personList.push(person);
      this.awaitingPersonList.splice(0, 1);
    }
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.value;
  }

  ngOnInit(): void {
  }
  
}

interface Endpoint{
   endpoint: string, method: string, security: string, table: string, properties: EndpointProperties[]  
}

interface EndpointProperties{
  endpoint: string, method: string, properties: string, column: string, require: string, type: string  
}