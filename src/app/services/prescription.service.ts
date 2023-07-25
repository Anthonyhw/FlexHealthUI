import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArchiveDto } from '../models/archiveDto.model';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(private http: HttpClient) { }

  GetPrescription(id: number): Observable<ArchiveDto> {
    return this.http.get<ArchiveDto>(env.api + `prescription/${id}`);
  }

  GetPrescriptionByUserId(id: number, visibleOnly :boolean): Observable<ArchiveDto[]> {
    return this.http.get<ArchiveDto[]>(env.api + `prescription/user/${id}?visibleOnly=${visibleOnly}`);
  }
  
  GetPrescriptionByScheduleId(id: number): Observable<ArchiveDto> {
    return this.http.get<ArchiveDto>(env.api + `prescription/schedule/${id}`);
  }

  CreatePrescription(prescription: FormData):Observable<ArchiveDto> {
    return this.http.post<ArchiveDto>(env.api + `prescription`, prescription);
  }

  downloadFile(filename: string) {
    return this.http.post(env.api + `prescription/download`, JSON.stringify(filename));
  }

  changeVisibility(id: number, visibility: boolean): Observable<boolean> {
    return this.http.put<boolean>(env.api + `prescription/${id}`, JSON.stringify(visibility));
  }
}
