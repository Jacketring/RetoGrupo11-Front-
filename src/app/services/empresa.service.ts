import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment.development';
import { Observable } from 'rxjs';
import { EmpresaResponseDto } from '../interfaces/empresa-response-dto';
import { EmpresaRequestDto } from '../interfaces/empresa-request-dto';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/empresa`;

  constructor() { }

  getEmpresas(): Observable<EmpresaResponseDto[]> {
    return this.http.get<EmpresaResponseDto[]>(`${this.apiUrl}/all`);
  }

  getEmpresaById(id: number): Observable<EmpresaResponseDto> {
    return this.http.get<EmpresaResponseDto>(`${this.apiUrl}/detail/${id}`);
  }
  
  updateEmpresa(id: number, empresa: EmpresaRequestDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, empresa);
  }

  deleteEmpresa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
}
