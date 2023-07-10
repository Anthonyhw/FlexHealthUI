import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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

  constructor(private http: HttpClient, private cookie: CookieService, private toastr: ToastrService) {}

  login(user: string, password: string) {
    this.http.post(
      env.api + 'account/login', 
      JSON.stringify({username: user.includes('@') ? '' : user, email: user.includes('@') ? user : '', password: password}),
      {headers: {'content-type': 'application/json'}}).subscribe ({
      next: (result:any) => {
        this.cookie.set('Token', result.token);
        var decodedToken = jwtDecode<any>(result.token);
        
        localStorage.setItem('user.Id', decodedToken.nameid);
        localStorage.setItem('user.Name', decodedToken.unique_name);
        localStorage.setItem('user.Role', decodedToken.role);
        if (decodedToken.Estabelecimento) {
          localStorage.setItem('doctor.Stablishment', decodedToken.Estabelecimento);
          localStorage.setItem('doctor.Crm', decodedToken.CRM);
          localStorage.setItem('doctor.Specialty', decodedToken.Especialidade);
        }else if (decodedToken.Cnpj) {
          localStorage.setItem('stablishment.Cnpj', decodedToken.Cnpj);
        }

        location.pathname = '/perfil'
      },
      error: (error) => {
        this.toastr.error(error.error, 'Erro!');
      }
    });
  }
}
