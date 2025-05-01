import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { VacanteResponseDto } from '../interfaces/vacante-response-dto';
import { VacanteRequestDto } from '../interfaces/vacante-request-dto';

@Injectable({
  providedIn: 'root',
})
export class VacanteService {
  private apiUrl = 'http://localhost:8445/vacante';
  private http = inject(HttpClient);

  getTodas(): Observable<VacanteResponseDto[]> {
    return this.http.get<VacanteResponseDto[]>(`${this.apiUrl}/todas`);
  }

  getCreadas(): Observable<VacanteResponseDto[]> {
    return this.http.get<VacanteResponseDto[]>(`${this.apiUrl}/creadas`);
  }

  getDetalle(id: number): Observable<VacanteResponseDto> {
    return this.http.get<VacanteResponseDto>(`${this.apiUrl}/detalle/${id}`);
  }

  crearVacante(vacante: VacanteRequestDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, vacante);
  }

  getMisVacantes(): Observable<VacanteResponseDto[]> {
    return this.http
      .get<VacanteResponseDto[]>(`${this.apiUrl}/misvacantes`)
      .pipe(
        tap((response) =>
          console.log('Respuesta original del servidor:', response)
        )
      );
  }

  editarVacante(
    idVacante: number,
    vacante: VacanteRequestDto
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/modificar/${idVacante}`, vacante);
  }

  cancelarVacante(idVacante: number): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/cancelar/${idVacante}`, {})
      .pipe(
        tap((response) =>
          console.log('Respuesta de cancelar vacante:', response)
        )
      );
  }
}
