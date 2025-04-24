import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UsuarioResponseDto } from '../../../interfaces/usuario-response-dto';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios-admin',
  imports: [],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css',
  standalone: true,
})
export class UsuariosAdminComponent {
  usuarios: UsuarioResponseDto[] = [];
  private usuarioService = inject(UsuarioService);

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.filter(u => u.rol === 'CLIENTE' || u.rol === 'EMPRESA');
      },
      error: (err) => console.error('Error al cargar usuarios:', err),
    });
  }

  deshabilitar(email: string) {
    const confirmar = confirm(`¿Deshabilitar al usuario ${email}?`);
    if (!confirmar) return;

    this.usuarioService.deshabilitarUsuario(email).subscribe({
      next: () => {
        this.usuarios = this.usuarios.map(u =>
          u.email === email ? { ...u, enabled: 0 } : u
        );
        alert('Usuario deshabilitado correctamente');
      },
      error: (err) => {
        console.error('Error al deshabilitar usuario:', err);
        alert('No se pudo deshabilitar el usuario');
      }
    });
  }

  habilitar(email: string) {
    const confirmar = confirm(`¿Habilitar al usuario ${email}?`);
    if (!confirmar) return;
  
    this.usuarioService.habilitarUsuario(email).subscribe({
      next: (res) => {
        alert(res.message || 'Usuario habilitado');
        this.usuarioService.getUsuarios().subscribe(data => {
          this.usuarios = data;
        });
      },
      error: (err) => {
        console.error('Error al habilitar:', err);
        alert(err.error?.message || 'Error al habilitar usuario');
      }
    });
  }

}
