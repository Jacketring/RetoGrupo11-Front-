import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioResponseDto } from '../../../interfaces/usuario-response-dto';
import { UsuarioRequestDto } from '../../../interfaces/usuario-request-dto';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditarPerfilComponent {
  form!: FormGroup;
  error: string | null = null;
  loading = false;
  emailUsuario!: string; // Guardar el email para usarlo en el PUT

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private auth = inject(AuthService);
  private cd = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Obtener el email del usuario autenticado desde el AuthService
    this.emailUsuario = this.authService.getEmailFromToken() || ''; // Obtener el token desde el servicio AuthService
  
    if (!this.emailUsuario) {
      // Si no existe el token, redirigir al login (o manejar el error de otra forma)
      this.router.navigate(['/login']);
      return;
    }
  
    // Inicializar el formulario
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      password: ['', Validators.required] // Asegúrate de que la contraseña sea requerida
    });
  
    // Obtener los datos del usuario para editar el perfil
    this.usuarioService.getUsuarioByEmail(this.emailUsuario).subscribe({
      next: (usuario: UsuarioResponseDto) => {
        this.form.patchValue({
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          password: '' // Campo de contraseña en blanco
        });
      },
      error: (err) => {
        this.error = '❌ No se pudo cargar tu perfil.';
        console.error(err);
        this.cd.markForCheck();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const usuarioEditado: UsuarioRequestDto = {
      email: this.emailUsuario, // El email no cambia
      nombre: this.form.value.nombre,
      apellidos: this.form.value.apellidos,
      password: this.form.value.password
    };

    // Actualizar el perfil del usuario
    this.usuarioService.updateUsuario(this.emailUsuario, usuarioEditado).subscribe({
      next: () => {
        alert('✅ Perfil actualizado con éxito');
        this.router.navigate(['/']); // Redirigir a la página principal (ajustar según la navegación)
      },
      error: (err) => {
        this.error = '❌ No se pudo actualizar tu perfil.';
        console.error(err);
        this.loading = false;
        this.cd.markForCheck();
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
