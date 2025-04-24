import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment.development';
import { SolicitudResponseDto } from '../interfaces/solicitud-response-dto';
import { Observable } from 'rxjs';
import { SolicitudRequestDto } from '../interfaces/solicitud-request-dto';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/solicitud`;

  getSolicitudes(): Observable<SolicitudResponseDto[]> {
    return this.http.get<SolicitudResponseDto[]>(`${this.apiUrl}/all`);
  }

  getSolicitudById(id: number): Observable<SolicitudResponseDto> {
    return this.http.get<SolicitudResponseDto>(`${this.apiUrl}/detail/${id}`);
  }

  createSolicitud(solicitud: SolicitudRequestDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, solicitud);
  }

  updateSolicitud(id: number, solicitud: SolicitudRequestDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, solicitud);
  }

  deleteSolicitud(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getMisSolicitudes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/missolicitudes`);
  }
  
}
