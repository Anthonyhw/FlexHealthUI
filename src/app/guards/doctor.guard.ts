import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

export const doctorGuard: CanActivateFn = (route, state) => {
  
  const cookie = inject(CookieService)
  var decodedToken = jwtDecode<any>(cookie.get('Token'))

  if (decodedToken && decodedToken.role == 'Medico') {
    return true
  }
  location.pathname = '/404'
  return false;
};
