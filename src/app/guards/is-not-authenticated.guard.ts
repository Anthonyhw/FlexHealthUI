import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  const cookie = inject(CookieService)

  if (cookie.get('Token') == '') {
    if (state.url.includes('doctor')) location.pathname = '/404';
    return true
  }
  return false;
};
