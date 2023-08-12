import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getNews(): Observable<any> {
    return this.http.get<any>(env.api + `news`)
  }

  getNewsById(id: number): Observable<any> {
    return this.http.get<any>(env.api + `news/${id}`)
  }
  createNew(form: FormData): Observable<any> {
    return this.http.post<any>(env.api + `news`, form)
  }
}
