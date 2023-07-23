import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { StablishmentAgenda } from '../models/stablishmentagenda.model';
import { Schedule } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  createSchedule(request: any) {
    return this.http.post<any>(env.api + 'schedule', JSON.stringify(request))
  }

  GetSchedulesByPatientId(id: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(env.api + `schedule/patient?id=${id}`);
  }

  getSchedulesByDoctorId(id: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(env.api + `schedule/doctor?id=${id}`);
  }

  getSchedulesByCity(city: string): Observable<StablishmentAgenda[]> {
    return this.http.get<StablishmentAgenda[]>(env.api + `schedule/city?city=${city}`)
  }

  scheduleToUser(request: any): Observable<any> {
    return this.http.put<any>(env.api + `schedule/user`, JSON.stringify(request));
  }

  deleteSchedule(id: number): Observable<boolean> {
    return this.http.delete<boolean>(env.api + `schedule?id=${id}`);
  }

  cancelSchedule(id: number): Observable<Schedule> {
    return this.http.put<Schedule>(env.api + `schedule/cancel`, JSON.stringify(id));
  }

  endSchedule(request: FormData): Observable<boolean> {
    return this.http.post<boolean>(env.api + `schedule/end`, request);
  }
}
