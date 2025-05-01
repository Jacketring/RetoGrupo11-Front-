import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitudResponseDto } from '../../../interfaces/solicitud-response-dto';
import { SolicitudService } from '../../../services/solicitud.service';

interface RespuestaForm {
  mensaje: string;
}

@Component({
  selector: 'app-solicitud-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './solicitud-detalle.component.html',
  styleUrl: './solicitud-detalle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudDetalleComponent implements OnInit {
  solicitud = signal<SolicitudResponseDto | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);
  enviandoRespuesta = signal<boolean>(false);
  respuestaExitosa = signal<boolean>(false);

  respuestaForm: FormGroup;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitudService = inject(SolicitudService);

  constructor() {
    this.respuestaForm = this.fb.group({
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Identificador de solicitud no válido');
      this.cargando.set(false);
      return;
    }

    this.cargarSolicitud(+id);
  }

  cargarSolicitud(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.solicitudService.getSolicitudById(id).subscribe({
      next: (solicitud) => {
        this.solicitud.set(solicitud);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la solicitud:', err);
        this.error.set(
          'No se pudo cargar la solicitud. Por favor, inténtalo de nuevo.'
        );
        this.cargando.set(false);
      },
    });
  }

  adjudicar(): void {
    if (!this.solicitud()) return;

    if (
      !confirm(
        '¿Estás seguro de adjudicar esta solicitud? Esta acción no se puede deshacer.'
      )
    )
      return;

    const id = this.solicitud()!.idSolicitud;

    this.solicitudService.adjudicarSolicitud(id).subscribe({
      next: (res) => {
        alert(res.message || 'Solicitud adjudicada correctamente');
        // Recargar la solicitud para actualizar su estado
        this.cargarSolicitud(id);
      },
      error: (err) => {
        alert(err.error?.message || 'Error al adjudicar solicitud');
      },
    });
  }

  enviarRespuesta(): void {
    if (this.respuestaForm.invalid) {
      return;
    }

    const formData = this.respuestaForm.value as RespuestaForm;

    // Como la respuesta a solicitudes es opcional según tus especificaciones,
    // vamos a simular esta funcionalidad ya que no tenemos un endpoint en el servicio
    this.enviandoRespuesta.set(true);

    // Simulación de envío de respuesta (se podría implementar en el backend más adelante)
    setTimeout(() => {
      console.log('Respuesta enviada:', {
        solicitudId: this.solicitud()?.idSolicitud,
        mensaje: formData.mensaje,
      });

      this.enviandoRespuesta.set(false);
      this.respuestaExitosa.set(true);
      this.respuestaForm.reset();

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => this.respuestaExitosa.set(false), 3000);
    }, 1000);

    // Cuando se implemente el endpoint real, se usaría algo como:
    /*
    this.solicitudService.responderSolicitud(this.solicitud()!.idSolicitud, formData).subscribe({
      next: (res) => {
        this.enviandoRespuesta.set(false);
        this.respuestaExitosa.set(true);
        this.respuestaForm.reset();
        setTimeout(() => this.respuestaExitosa.set(false), 3000);
      },
      error: (err) => {
        this.enviandoRespuesta.set(false);
        alert('Error al enviar la respuesta: ' + (err.error?.message || 'Error desconocido'));
      }
    });
    */
  }

  volver(): void {
    this.router.navigate(['/empresa/solicitudes']);
  }
}
