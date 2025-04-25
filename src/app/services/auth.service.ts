import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponseDto } from '../interfaces/loginResponseDto';
import { RegistroResponseDto } from '../interfaces/registro-response-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {}

  login(credentials: { email: string; password: string }): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, credentials);
  }

  register(data: any): Observable<RegistroResponseDto> {
    return this.http.post<RegistroResponseDto>(`${this.apiUrl}/registro`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  redirectByRole(role: string) {
    switch (role) {
      case 'CLIENTE':
        this.router.navigate(['/cliente/mis-solicitudes']);
        break;
      case 'EMPRESA':
        this.router.navigate(['/empresa/mis-vacantes']);
        break;
      case 'ADMON':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/vacantes']);
    }
  }

  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }


}
