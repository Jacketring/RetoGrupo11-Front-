import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment.development';
import { Observable } from 'rxjs';
import { CategoriaDto } from '../interfaces/categoria-dto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categoria`;

  getCategorias(): Observable<CategoriaDto[]> {
    return this.http.get<CategoriaDto[]>(`${this.apiUrl}/all`);
  }

  createCategoria(categoria: CategoriaDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, categoria);
  }

  updateCategoria(id: number, categoria: CategoriaDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getCategoriaById(id: number): Observable<CategoriaDto> {
    return this.http.get<CategoriaDto>(`${this.apiUrl}/detail/${id}`);
  }
}
