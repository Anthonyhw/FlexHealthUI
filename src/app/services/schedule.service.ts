import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgendamentoDto } from '../models/agendamentoDto.model';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  createSchedule(request: any) {
    return this.http.post<any>(env.api + 'schedule', JSON.stringify(request))
  }
}
