import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  const cookie = inject(CookieService)


  if (cookie.get('Token') != '') {    
    return true
  }
  location.pathname = '/login'
  return false;
};
