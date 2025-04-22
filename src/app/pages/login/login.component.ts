import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  error: string | null = null;
  loading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.createForm();
  }
 

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        const authResponse =
          typeof response === 'string' ? JSON.parse(response) : response;

        this.authService.saveToken(authResponse.token);
        this.authService.saveRole(authResponse.tipoRol);
        const rol = authResponse.tipoRol;

        switch (rol) {
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
            this.router.navigate(['/vacantes']); // fallback
            break;
        }
      },
      error: (err) => {
        this.error = 'Login failed. Please check your credentials.';
        this.loading = false;
        console.error('Login error:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
