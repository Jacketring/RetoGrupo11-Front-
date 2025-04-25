import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment.development';
import { Observable } from 'rxjs';
import { UsuarioResponseDto } from '../interfaces/usuario-response-dto';
import { UsuarioRequestDto } from '../interfaces/usuario-request-dto';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;
  private authService = inject(AuthService);

  getUsuarios(): Observable<UsuarioResponseDto[]> {
    return this.http.get<UsuarioResponseDto[]>(`${this.apiUrl}/usuario/all`);
  }

  deshabilitarUsuario(email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/deshabilitar/${email}`, null);
  }

  habilitarUsuario(email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/habilitar/${email}`, null);
  }

  crearAdministrador(data: {
    email: string;
    nombre: string;
    apellidos: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add`, data);
  }

  getUsuarioByEmail(email: string): Observable<UsuarioResponseDto> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<UsuarioResponseDto>(`${this.apiUrl}/usuario/detail/${email}`, { headers });
  }
  
  updateUsuario(email: string, usuario: UsuarioRequestDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/edit/${email}`, usuario);
  }
}
