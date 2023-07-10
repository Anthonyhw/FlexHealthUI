import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isCollapsed = false;

  showHeader: boolean;
  headerType: string;
  nome: string;

  constructor(private cookie: CookieService) {}

  ngDoCheck() {
    this.verifyAuthentication()
  }

  
  verifyAuthentication() {
    var token = this.cookie.get('Token');
    if (token != '') {
      
      var decodedToken = jwt_decode<any>(token);
      var nomeSeparado = decodedToken.unique_name.split(" ")
      this.nome = nomeSeparado[0] + " " + nomeSeparado[nomeSeparado.length-1];
      this.headerType = decodedToken.role;
      this.showHeader = true
    }else {
      this.showHeader  = false
    }
  }

  logout() {
    
    this.cookie.deleteAll('/');
    this.cookie.delete('Token');
    localStorage.clear()
    location.pathname = '/login'
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
