import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SolicitudResponseDto } from '../../../interfaces/solicitud-response-dto';
import { SolicitudService } from '../../../services/solicitud.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-solicitudes-vacante',
  imports: [CommonModule, RouterModule],
  templateUrl: './solicitudes-vacante.component.html',
  styleUrl: './solicitudes-vacante.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolicitudesVacanteComponent {
  solicitudesAgrupadas: Record<string, SolicitudResponseDto[]> = {};
  private solicitudService = inject(SolicitudService);

  ngOnInit(): void {
    this.solicitudService.getSolicitudesByEmpresa().subscribe({
      next: (solicitudes) => {
        this.solicitudesAgrupadas = solicitudes.reduce((acc, solicitud) => {
          const vacante = solicitud.vacanteNombre;
          if (!acc[vacante]) acc[vacante] = [];
          acc[vacante].push(solicitud);
          return acc;
        }, {} as Record<string, SolicitudResponseDto[]>);
      },
      error: (err) => console.error('Error al cargar solicitudes:', err),
    });
  }

  getVacanteKeys(): string[] {
    return Object.keys(this.solicitudesAgrupadas || {});
  }

  adjudicar(id: number) {
    if (!confirm('¿Estás seguro de adjudicar esta solicitud? Esta acción no se puede deshacer.')) return;
  
    this.solicitudService.adjudicarSolicitud(id).subscribe({
      next: (res) => {
        alert(res.message || 'Solicitud adjudicada correctamente');
        this.ngOnInit(); // volver a cargar las solicitudes
      },
      error: (err) => {
        alert(err.error?.message || 'Error al adjudicar solicitud');
      }
    });
  }
}
