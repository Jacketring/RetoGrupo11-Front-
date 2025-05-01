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

  /*verDetalle(solicitud: SolicitudResponseDto) {
    // Si tienes ID único, pásalo en la URL. Si no, puedes mandar datos al detalle de otra manera.
    // Aquí asumo que vas a pasar la fecha como ID temporal.
    this.router.navigate(['/cliente/solicitud', encodeURIComponent(solicitud.fecha.toString())]);
  }*/
    verDetalle(solicitud: SolicitudResponseDto) {
      if (solicitud && solicitud.idSolicitud) {
        this.router.navigate(['/cliente/solicitud', solicitud.idSolicitud]);
      } else {
        console.error('ID de solicitud no válido:', solicitud);
      }
    }

  getEstadoTexto(estado: number): string {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'Aceptada';
      case 2: return 'Rechazada';
      default: return 'Desconocido';
    }
  }

  eliminarSolicitud(id: number) {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?');

    if (confirmacion) {
      this.solicitudService.deleteSolicitud(id).subscribe({
        next: () => {
          alert('✅ Solicitud eliminada correctamente');
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('❌ Error al eliminar la solicitud', err);
          alert('Hubo un error al eliminar la solicitud');
        }
      });
    }
  }
}

