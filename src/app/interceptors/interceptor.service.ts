import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor(private cookie: CookieService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        var cookie = this.cookie.get('Token');

        if (cookie != '' || !request.url.includes('viacep')) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + cookie
                }
            });
            return next.handle(request);
        }

        return next.handle(request);
    }
}