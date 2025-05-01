import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitudResponseDto } from '../../../interfaces/solicitud-response-dto';
import { SolicitudService } from '../../../services/solicitud.service';
import { FormsModule } from '@angular/forms';
import { SolicitudRequestDto } from '../../../interfaces/solicitud-request-dto';

@Component({
  selector: 'app-solicitudes-gestion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './solicitudes-vacante.component.html',
  styleUrls: ['./solicitudes-vacante.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesVacanteComponent implements OnInit {
  // Usando signals para mejor rendimiento con OnPush
  solicitudesAgrupadas = signal<Record<string, SolicitudResponseDto[]>>({});
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);
  filtroEstado = signal<string>('todos'); // 'todos', 'pendientes', 'adjudicadas'

  private solicitudService = inject(SolicitudService);

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.solicitudService.getSolicitudesByEmpresa().subscribe({
      next: (solicitudes) => {
        // Agrupar solicitudes por vacante
        const agrupadas = solicitudes.reduce((acc, solicitud) => {
          const vacante = solicitud.vacanteNombre;
          if (!acc[vacante]) acc[vacante] = [];
          acc[vacante].push(solicitud);
          return acc;
        }, {} as Record<string, SolicitudResponseDto[]>);

        this.solicitudesAgrupadas.set(agrupadas);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
        this.error.set(
          'No se pudieron cargar las solicitudes. Por favor, inténtalo de nuevo.'
        );
        this.cargando.set(false);
      },
    });
  }

  getVacanteKeys(): string[] {
    return Object.keys(this.solicitudesAgrupadas() || {});
  }

  getSolicitudesFiltradas(vacante: string): SolicitudResponseDto[] {
    const solicitudes = this.solicitudesAgrupadas()[vacante] || [];

    if (this.filtroEstado() === 'todos') {
      return solicitudes;
    } else if (this.filtroEstado() === 'pendientes') {
      return solicitudes.filter((s) => s.estado === 0);
    } else {
      return solicitudes.filter((s) => s.estado === 1);
    }
  }

  cambiarFiltro(filtro: string): void {
    this.filtroEstado.set(filtro);
  }

  adjudicar(id: number): void {
    if (
      !confirm(
        '¿Estás seguro de adjudicar esta solicitud? Esta acción no se puede deshacer.'
      )
    )
      return;

    this.solicitudService.adjudicarSolicitud(id).subscribe({
      next: (res) => {
        alert(res.message || 'Solicitud adjudicada correctamente');
        this.cargarSolicitudes(); // Recargar solicitudes para actualizar el estado
      },
      error: (err) => {
        alert(err.error?.message || 'Error al adjudicar solicitud');
      },
    });
  }

  hayPendientes(vacante: string): boolean {
    return (this.solicitudesAgrupadas()[vacante] || []).some(
      (s) => s.estado === 0
    );
  }

  contarPendientes(vacante: string): number {
    return (this.solicitudesAgrupadas()[vacante] || []).filter(
      (s) => s.estado === 0
    ).length;
  }

  contarAdjudicadas(vacante: string): number {
    return (this.solicitudesAgrupadas()[vacante] || []).filter(
      (s) => s.estado === 1
    ).length;
  }

  // Nuevo método para postular a una vacante
  postularVacante(vacanteId: number, solicitudData: SolicitudRequestDto): void {
    this.solicitudService.postularVacante(vacanteId, solicitudData).subscribe({
      next: (res) => {
        alert('✅ Solicitud enviada correctamente.');
        this.cargarSolicitudes(); // Recargar solicitudes para obtener la nueva postulación
      },
      error: (err) => {
        alert(
          '❌ Error al enviar solicitud: ' +
            (err.error?.message || 'Ocurrió un error.')
        );
      },
    });
  }
}
