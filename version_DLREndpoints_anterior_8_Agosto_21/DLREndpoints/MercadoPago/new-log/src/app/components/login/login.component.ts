import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../service/servicios.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  password: string;
  error;

  constructor(private serv: ServiciosService) {

    this.usuario = "";
    this.password = "";
  }

  ngOnInit(): void { }

  async posteo() {

    try {

      let response = await this.serv.postUsuario({ user: this.usuario, password: this.password }).toPromise();

      if (response.status != 400) {

        this.serv.setLogged(true);
        this.serv.setUser(this.usuario, response);
        this.serv.goToHome();

      } else {
        console.log(response);
        console.error('login error');

      }

    } catch (error) {
      this.error = error;
      if (this.usuario == "" || this.password == "") {

        console.error('empty fields');
      } else {

        if (error.status == 400) {

          console.error('login error');
        }
      }
    }
  }
}
