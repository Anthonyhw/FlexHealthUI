import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

export const registerGuard: CanActivateChildFn = (childRoute, state) => {
    
  const cookie = inject(CookieService)
  var token = cookie.get('Token')
  if (token == '' && state.url.includes('patient')) return true;

  if (token == '' && state.url.includes('stablishment')) return true;
  
  const decodedToken = jwtDecode<any>(token);


  if (state.url.includes('doctor') && decodedToken.role == 'Estabelecimento') return true

  return false
};
