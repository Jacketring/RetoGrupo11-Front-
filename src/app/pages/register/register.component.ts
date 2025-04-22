import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RegistroResponseDto } from '../../interfaces/registro-response-dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  error: string | null = null;
  loading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    this.loading = true;
    this.error = null;

    const { name, email, password } = this.registerForm.value;
    const usuario = {
      email,
      nombre: name,
      apellidos: 'Sin Apellidos',
      password,
    };

    console.log('Registrando usuario...', usuario);

    this.authService.register({ usuario }).subscribe({
      next: (response: RegistroResponseDto) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'El registro falló. Revisa los datos.';
        this.loading = false;
        console.error('Error al registrar:', err);
      },
      complete: () => {
        console.log('Registro completo');
        this.loading = false;
      },
    });
  }
  
}
