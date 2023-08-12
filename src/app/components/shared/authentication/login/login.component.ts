import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Route } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { env } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user: string = '';
  password: string = '';
  previousRoute: string;

  constructor(private http: HttpClient, private cookie: CookieService, private toastr: ToastrService) { }

  ngOnInit() {
    if (localStorage.getItem('registerRedirect') == 'true') {
      this.toastr.success('Cadastro efetuado com sucesso!');
      localStorage.removeItem('registerRedirect')
    }
  }

  login(user: string, password: string) {
    this.http.post(
      env.api + 'account/login', 
      JSON.stringify({username: user.includes('@') ? '' : user, email: user.includes('@') ? user : '', password: password}),
      {headers: {'content-type': 'application/json'}}).subscribe ({
      next: (result:any) => {
        var decodedToken = jwtDecode<any>(result.token);
        this.cookie.set('Token', result.token, new Date(decodedToken.exp*1000));
        
        localStorage.setItem('User.Id', decodedToken.nameid);
        localStorage.setItem('User.Name', decodedToken.unique_name);
        localStorage.setItem('User.Role', decodedToken.role);
        
        if (decodedToken.Estabelecimento) {
          localStorage.setItem('Doctor.Stablishment', decodedToken.Estabelecimento);
          localStorage.setItem('Doctor.Crm', decodedToken.CRM);
          localStorage.setItem('Doctor.Specialty', decodedToken.Especialidade);
        }else if (decodedToken.CNPJ) {
          localStorage.setItem('Stablishment.Cnpj', decodedToken.CNPJ);
          localStorage.setItem('Stablishment.Type', decodedToken.Tipo);
        }

        if (decodedToken.role == 'Paciente') {
          location.pathname = '/news';
        }else {
          location.pathname = '/perfil'
        }
      },
      error: (error) => {
        this.toastr.error(error.message, 'Erro!');
      }
    });
  }
}
