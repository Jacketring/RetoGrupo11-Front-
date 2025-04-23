import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment.development';
import { AltaEmpresaRequestDto } from '../interfaces/alta-empresa-request-dto';
import { Observable } from 'rxjs';
import { AltaEmpresaResponseDto } from '../interfaces/alta-empresa-response-dto';

@Injectable({
  providedIn: 'root'
})
export class EmpresaAdminService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor() { }

  altaEmpresa(data: AltaEmpresaRequestDto): Observable<AltaEmpresaResponseDto> {
    return this.http.post<AltaEmpresaResponseDto>(`${this.apiUrl}/alta/empresa`, data);
  }

  
}
