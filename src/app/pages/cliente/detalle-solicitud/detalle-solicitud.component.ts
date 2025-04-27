import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud.service';
import { SolicitudResponseDto } from '../../../interfaces/solicitud-response-dto';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-solicitud',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleSolicitudComponent implements OnInit {
  solicitud!: SolicitudResponseDto;

  constructor(
    private solicitudService: SolicitudService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idSolicitud = Number(this.route.snapshot.paramMap.get('id'));

    this.solicitudService.getSolicitudById(idSolicitud).subscribe({
      next: (solicitud: SolicitudResponseDto) => {
        this.solicitud = solicitud;
        console.log(solicitud);
      },
      error: (err) => {
        console.error('Error al cargar la solicitud:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['cliente/mis-solicitudes']);  // O la ruta que prefieras
  }
}
