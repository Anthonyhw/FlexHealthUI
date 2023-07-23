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

  CreatePrescription(prescription: FormData):Observable<ArchiveDto> {
    return this.http.post<ArchiveDto>(env.api + `prescription`, prescription);
  }
}
