import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VacanteResponseDto } from '../interfaces/vacante-response-dto';

@Injectable({
  providedIn: 'root'
})
export class VacanteService {

  private apiUrl = 'http://localhost:8445/vacante'
  private http = inject(HttpClient);
  
  getTodas(): Observable<VacanteResponseDto[]> {
    return this.http.get<VacanteResponseDto[]>(`${this.apiUrl}/todas`);
  }

  getDetalle(id: number): Observable<VacanteResponseDto> {
    return this.http.get<VacanteResponseDto>(`${this.apiUrl}/detalle/${id}`);
  }


}
