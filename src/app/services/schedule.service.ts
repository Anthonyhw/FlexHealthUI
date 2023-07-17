import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { StablishmentAgenda } from '../models/stablishmentagenda.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  createSchedule(request: any) {
    return this.http.post<any>(env.api + 'schedule', JSON.stringify(request))
  }

  getSchedulesByCity(city: string): Observable<StablishmentAgenda[]> {
    return this.http.get<StablishmentAgenda[]>(env.api + `schedule/city?city=${city}`)
  }

  scheduleToUser(request: any): Observable<any> {
    return this.http.put<any>(env.api + `schedule`, JSON.stringify(request));
  }
}
