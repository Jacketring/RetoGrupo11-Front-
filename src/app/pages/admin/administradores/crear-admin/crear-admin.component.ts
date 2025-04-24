import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-crear-admin',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-admin.component.html',
  styleUrl: './crear-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearAdminComponent {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const nuevoAdmin = this.form.value;

    this.usuarioService.crearAdministrador(nuevoAdmin).subscribe({
      next: (res) => {
        alert(res.message || 'Administrador creado correctamente');
        this.router.navigate(['/admin/admins']);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Error al crear el administrador.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
