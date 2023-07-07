import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isCollapsed = false;

  showHeader: boolean;

  constructor(private cookie: CookieService) {}

  ngDoCheck() {
    this.verifyAuthentication()
  }

  
  verifyAuthentication() {
    if (this.cookie.get('Token') != '') {
      this.showHeader = true
    }else {
      this.showHeader  = false
    }
  }

  logout() {
    this.cookie.deleteAll();
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
