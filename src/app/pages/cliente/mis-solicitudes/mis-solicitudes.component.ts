import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud.service';
import { SolicitudResponseDto } from '../../../interfaces/solicitud-response-dto';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-solicitudes.component.html',
})
export class MisSolicitudesComponent {
  solicitudes: SolicitudResponseDto[] = [];
  error: string | null = null;

  private solicitudService = inject(SolicitudService);
  private router = inject(Router);

  ngOnInit(): void {
    this.solicitudService.getMisSolicitudes().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.solicitudes = data;
          this.error = null;
        } else if (data.message) {
          this.solicitudes = [];
          this.error = data.message;
        }
      },
      error: (err) => {
        console.error('Error cargando solicitudes:', err);
      }
    });
  }

  verDetalle(solicitud: SolicitudResponseDto) {
    // Si tienes ID único, pásalo en la URL. Si no, puedes mandar datos al detalle de otra manera.
    // Aquí asumo que vas a pasar la fecha como ID temporal.
    this.router.navigate(['/cliente/solicitud', encodeURIComponent(solicitud.fecha.toString())]);
  }

  getEstadoTexto(estado: number): string {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'Aceptada';
      case 2: return 'Rechazada';
      default: return 'Desconocido';
    }
  }
}

