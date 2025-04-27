import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
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
  loading = false;

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required]
    });

    // Obtener los datos del usuario
    this.usuarioService.getMiUsuario().subscribe({
      next: (usuario: UsuarioResponseDto) => {
        this.form.patchValue({
          nombre: usuario.nombre,
          apellidos: usuario.apellidos
        });
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const usuarioEditado: UsuarioRequestDto = {
      nombre: this.form.value.nombre,
      apellidos: this.form.value.apellidos
    };

    // Actualizar el perfil sin la contraseña
    this.usuarioService.updateMiUsuario(usuarioEditado).subscribe({
      next: () => {
        alert('✅ Perfil actualizado correctamente');
        this.router.navigate(['/cliente/mis-solicitudes']); // Redirigir a inicio o donde prefieras
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        alert('❌ Error al actualizar perfil');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
