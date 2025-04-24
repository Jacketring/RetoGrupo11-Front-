import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UsuarioResponseDto } from '../../../interfaces/usuario-response-dto';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administradores',
  imports: [],
  templateUrl: './administradores.component.html',
  styleUrl: './administradores.component.css',
  standalone: true,
})
export class AdministradoresComponent {
  administradores: UsuarioResponseDto[] = [];
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.administradores = data.filter(u => u.rol === 'ADMON');
      },
      error: (err) => console.error('Error al cargar administradores:', err),
    });
  }

  crearAdmin() {
    this.router.navigate(['/admin/admins/crear']);
  }
}
