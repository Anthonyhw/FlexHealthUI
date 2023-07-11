import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgendamentoDto } from '../models/agendamentoDto.model';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  createSchedule(request: AgendamentoDto) {
    return this.http.post<AgendamentoDto>(env.api + 'schedule', JSON.stringify(request))
  }
}
