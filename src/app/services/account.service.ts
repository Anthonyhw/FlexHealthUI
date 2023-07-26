import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Stablishment } from '../models/stablishment.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  getUser(): Observable<User> {
    return this.http.get<User>(env.api + 'account/getuser')
  }

  getUserById(id: number): Observable<Stablishment> {
    return this.http.get<Stablishment>(env.api + `account/getUserById/${id}`);
  }

  updateImage(formData: FormData, fileName: string): Observable<boolean> {
    return this.http.put<boolean>(env.api + `account/image?fileName=${fileName}`, formData); 
  }
}
