import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EndpointProperties, Endpoints } from './interfaces';
import { faTimes, faTags, faCheck,  } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPaperPlane, faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
 
  constructor(private api: ApiService){
    this.endpoints=[];  
    this.title= 'dlr-proyect';
    this.endpoint= {};
    this.endpointSelecionado = {endpoint:"", metodo:"", seguridad:"", tabla:"", editable:false, agregar:false, endpointProp:[], backupEndpoint:'', backupMetodo:''};
  }

  async ngOnInit() {

    this.getEndpoints().subscribe(data => {
      this.endpoints = data
      this.endpoints.forEach(k => {
        k.endpointProp = [];
        k.editable=false;
        k.editableAgregar=false;
        k.agregar=false;
        k.backupEndpoint=k.endpoint;
        k.backupMetodo=k.metodo;
      });
      this.getProperties().subscribe(data => {
        this.endpoints.forEach(k => {
          data.forEach(e => {
            if (k.endpoint === e.endpoint && k.metodo === e.metodo) {
              e.editableP=false;
              k.endpointProp.push(e);
              e.backupEndpoint = e.endpoint;
              e.backupMetodo = e.metodo
            }
          })
        })
      });
    });
  }

  onClick(endpo:Endpoints, pro: EndpointProperties){
    endpo.editable=!endpo.editable
    pro.editableP=!pro.editableP

    endpo.agregar=!endpo.agregar
    endpo.editableAgregar=!endpo.editableAgregar
  }


  getEndpoints(): Observable<Endpoints[]>{
    return  this.api.getEndpoints();
  }

  getProperties(): Observable<EndpointProperties[]>{
    return this.api.getProperties();
  }

  deleteEndpoints(endpoint: string, metodo: string): void {

    if (window.confirm("Estas seguro de borrar este endpoint?")) {
      
      this.api.deleteEndpoints(endpoint, metodo).subscribe(response => {
       
        this.getEndpoints().subscribe(data => {
          this.endpoints = data
          this.endpoints.forEach(k => {
            k.endpointProp = [];
            k.editable=false;
            k.editableAgregar=false;
            k.agregar=false
            k.backupEndpoint=k.endpoint;
            k.backupMetodo=k.metodo;
          });
          this.getProperties().subscribe(data => {
            this.endpoints.forEach(k => {
              data.forEach(e => {
                if (k.endpoint === e.endpoint && k.metodo === e.metodo) {
                  k.endpointProp.push(e);
                  e.backupEndpoint = e.endpoint;
                  e.backupMetodo = e.metodo
                }
              })
            })
          });
        });

        window.confirm("El endpoint fue eliminado exitosamente.");

      }, 
      (error) => {
        console.error(error, "No se pudo borrar el endpoint");
      });
    }
  }

  deleteProperties(endpoint: string, metodo: string, propiedad: string): void {

    if (window.confirm("Estas seguro de borrar esta propiedad?")) {
      
      this.api.deleteProperties(endpoint, metodo, propiedad).subscribe(response => {

        this.getEndpoints().subscribe(data => {
          this.endpoints = data
          this.endpoints.forEach(k => {
            k.endpointProp = [];
            k.editable=false;
            k.editableAgregar=false;
            k.agregar=false
            k.backupEndpoint=k.endpoint;
            k.backupMetodo=k.metodo;
          });
          this.getProperties().subscribe(data => {
            this.endpoints.forEach(k => {
              data.forEach(e => {
                if (k.endpoint === e.endpoint && k.metodo === e.metodo) {
                  k.endpointProp.push(e);
                  e.backupEndpoint = e.endpoint;
                  e.backupMetodo = e.metodo
                }
              })
            })
          });
        });

        window.confirm("La propiedad fue eliminada exitosamente.");
      }, 
      (error) => {
        console.error(error, "No se pudo borrar la propiedad");
      });
    }
  }


  putEndpoints(endpoints:Endpoints): void{

    if (window.confirm("Confirmar edicion del endpoint?")) {
    
      this.api.putEndpoints(endpoints).subscribe(data => {
       
        this.getEndpoints().subscribe(data => {
          this.endpoints = data
          this.endpoints.forEach(k => {
            k.endpointProp = [];
            k.editable=false;
            k.editableAgregar=false;
            k.agregar=false
            k.backupEndpoint=k.endpoint;
            k.backupMetodo=k.metodo;
          });
          this.getProperties().subscribe(data => {
            this.endpoints.forEach(k => {
              data.forEach(e => {
                if (k.endpoint === e.endpoint && k.metodo === e.metodo) {
                  k.endpointProp.push(e);
                  e.backupEndpoint = e.endpoint;
                  e.backupMetodo = e.metodo
                }
              })
            })
          });
        });

        window.confirm("El endpoint fue actualizado exitosamente.");
        
      }), (error) => {
        console.error(error, "No se pudo editar el endpoint");
      };
    }
  }

  putProperties(properties:EndpointProperties): void{

    if (window.confirm("Confirmar edicion de la propiedad?")) {
    
      this.api.putProperties(properties).subscribe(data => {
        
        this.getEndpoints().subscribe(data => {
          this.endpoints = data
          this.endpoints.forEach(k => {
            k.endpointProp = [];
            k.editable=false;
            k.editableAgregar=false;
            k.agregar=false
            k.backupEndpoint=k.endpoint;
            k.backupMetodo=k.metodo;
          
          });
          this.getProperties().subscribe(data => {
            this.endpoints.forEach(k => {
              data.forEach(e => {
                if (k.endpoint === e.endpoint && k.metodo === e.metodo) {
                  k.endpointProp.push(e);
                  e.backupEndpoint = e.endpoint;
                  e.backupMetodo = e.metodo
                }
              })
            })
          });
        });
        
      }), (error) => {
        console.error(error, "No se pudo editar la propiedad");
      };
    }
  }

  postEndpoints(endpoint: Endpoints){
    if (window.confirm("Confirma el envio del endpoint?")) {
      this.api.postEndpoints(endpoint).subscribe(resp => {
        endpoint.agregar = false
        // refresh automatico
        this.getEndpoints().subscribe(data => {
          this.endpoints = data
          this.endpoints.forEach(k => {
            k.endpointProp = [];
            k.editable=false;
            k.editableAgregar=false;
            k.agregar=false;
            k.backupEndpoint=k.endpoint;
            k.backupMetodo=k.metodo;
          
          });
          this.getProperties().subscribe(data => {
            this.endpoints.forEach(k => {
              data.forEach(e => {
                if (k.endpoint === e.endpoint && k.metodo === e.metodo) {
                  k.endpointProp.push(e);
                  e.backupEndpoint = e.endpoint;
                  e.backupMetodo = e.metodo
                }
              })
            })
          });
        });
        window.confirm("El endpoint fue posteado exitosamente.");
      })
    }
  }

  postProperties(properties: EndpointProperties){
    if (window.confirm("Confirma el envio de la propiedad?")) {
      this.api.postProperties(properties).subscribe(resp => {
  
        // refresh automatico
        this.getEndpoints().subscribe(data => {
          this.endpoints = data
          this.endpoints.forEach(k => {
            k.endpointProp = [];
            k.editable=false;
            k.editableAgregar=false;
            k.agregar=false
            k.backupEndpoint=k.endpoint;
            k.backupMetodo=k.metodo;
          
          });
          this.getProperties().subscribe(data => {
            this.endpoints.forEach(k => {
              data.forEach(e => {
                if (k.endpoint === e.endpoint && k.metodo === e.metodo) {
                  k.endpointProp.push(e);
                  e.backupEndpoint = e.endpoint;
                  e.backupMetodo = e.metodo
                }
              })
            })
          });
        });
        window.confirm("Las propiedades del endpoint fueron posteadas exitosamente.");
      })
    }
  }

  editEndpoints(endpoint:Endpoints): void {
    endpoint.editable=true;
  }

  noEditEndpoints(endpoint:Endpoints): void {
    if (endpoint.editable==true){
      endpoint.editable=false;      
    }
  }

  editEndpointProperties(endpointP:EndpointProperties): void {
    endpointP.editableP=true;
  }

  noEditEndpointProperties(endpointP:EndpointProperties): void {
    if (endpointP.editableP==true) {
      endpointP.editableP=false;
    }
  }

  addEndpoints(): void{
    this.endpoint = {endpoint:"", metodo:"", seguridad:"", tabla:"", editableAgregar:true, agregar:true, endpointProp: []};
    this.endpoints.push(this.endpoint)
  }

  noAddEndpoints(i, endpoint: Endpoints): void{
    this.endpoints.slice(i, 1);
    if (this.endpointSelecionado.agregar==true){
      this.endpointSelecionado.agregar=false;      
    }
  }

  Modal(endpoint:Endpoints){
    this.endpointSelecionado = endpoint;
  }

  ojo = faEye;
  faTimes = faTimes;
  agregar = faTags;
  enviar = faPaperPlane;
  confirmar = faCheck;
  borrar = faTrashAlt;
  editar = faEdit;
  
  endpoints: Endpoints[];
  properties: EndpointProperties[];
  title: string;
  endpoint: any;
  property: any;
  endpointSelecionado : Endpoints;
}