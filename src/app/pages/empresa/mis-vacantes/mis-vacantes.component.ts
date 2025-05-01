import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { VacanteResponseDto } from '../../../interfaces/vacante-response-dto';
import { VacanteService } from '../../../services/vacante.service';

@Component({
  selector: 'app-mis-vacantes',
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-vacantes.component.html',
  styleUrl: './mis-vacantes.component.css',
  standalone: true,
})
export class MisVacantesComponent implements OnInit {
  vacantes: VacanteResponseDto[] = [];
  vacantesCanceladas: Set<number> = new Set(); // Conjunto para trackear IDs de vacantes canceladas localmente
  imagenesError: { [key: number]: boolean } = {};

  private vacanteService = inject(VacanteService);
  private router = inject(Router);

  ngOnInit(): void {
    // Recuperar vacantes canceladas del localStorage al iniciar
    this.cargarVacantesCanceladas();
    this.cargarVacantes();
  }

  cargarVacantesCanceladas(): void {
    const canceladasGuardadas = localStorage.getItem('vacantesCanceladas');
    if (canceladasGuardadas) {
      const idsArray: number[] = JSON.parse(canceladasGuardadas);
      this.vacantesCanceladas = new Set(idsArray);
      console.log(
        'Vacantes canceladas cargadas del localStorage:',
        this.vacantesCanceladas
      );
    }
  }

  guardarVacantesCanceladas(): void {
    localStorage.setItem(
      'vacantesCanceladas',
      JSON.stringify([...this.vacantesCanceladas])
    );
  }

  cargarVacantes(): void {
    this.vacanteService.getMisVacantes().subscribe({
      next: (data) => {
        console.log('Datos originales del servidor:', data);

        // Filtrar vacantes que han sido canceladas localmente
        this.vacantes = data.filter(
          (vacante) =>
            // No mostrar si está en nuestra lista de canceladas local
            !this.vacantesCanceladas.has(vacante.idVacante) &&
            // No mostrar si el estatus es "CANCELADA" o similar
            vacante.estatus?.toLowerCase() !== 'cancelada'
        );

        console.log('Vacantes después de filtrado local:', this.vacantes);
      },
      error: (err) => {
        console.error('Error al cargar vacantes:', err);
      },
    });
  }

  manejarErrorImagen(id: number): void {
    this.imagenesError[id] = true;
  }

  esUrlImagen(url: string): boolean {
    if (!url) return false;
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null ||
      url.startsWith('http') ||
      url.startsWith('https') ||
      url.startsWith('data:image')
    );
  }

  obtenerUrlImagen(urlImagen: string): string {
    if (
      urlImagen.startsWith('http') ||
      urlImagen.startsWith('https') ||
      urlImagen.startsWith('data:image')
    ) {
      return urlImagen;
    }
    return `/assets/images/${urlImagen}`;
  }

  editar(id: number) {
    this.router.navigate(['/empresa/vacante/editar', id]);
  }

  cancelar(id: number) {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas cancelar esta vacante?'
    );

    if (confirmacion) {
      console.log('Cancelando vacante con id:', id);

      this.vacanteService.cancelarVacante(id).subscribe({
        next: (response) => {
          console.log('Respuesta de cancelación:', response);

          // Agregar el ID a nuestro conjunto de vacantes canceladas
          this.vacantesCanceladas.add(id);
          this.guardarVacantesCanceladas();

          // Eliminar la vacante del arreglo local
          this.vacantes = this.vacantes.filter(
            (vacante) => vacante.idVacante !== id
          );

          console.log(
            'Vacante eliminada localmente. Total actual:',
            this.vacantes.length
          );
          alert('✅ Vacante cancelada correctamente');
        },
        error: (err) => {
          alert('❌ Hubo un error al cancelar la vacante');
        },
      });
    }
  }

  nuevaVacante() {
    this.router.navigate(['/empresa/vacante/nueva']);
  }
}
