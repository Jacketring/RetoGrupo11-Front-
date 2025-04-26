import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { VacanteResponseDto } from '../../../interfaces/vacante-response-dto';
import { VacanteService } from '../../../services/vacante.service';

@Component({
  selector: 'app-mis-vacantes',
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-vacantes.component.html',
  styleUrl: './mis-vacantes.component.css',
  standalone: true
})
export class MisVacantesComponent {
  vacantes: VacanteResponseDto[] = [];

  private vacanteService = inject(VacanteService);
  private router = inject(Router);

  ngOnInit(): void {
    this.vacanteService.getMisVacantes().subscribe({
      next: (data) => {
        this.vacantes = data;
        console.log("que vacantes tengo", this.vacantes)
      },
      error: (err) => {
        console.error('Error al cargar vacantes:', err);
      }
    });
  }

  editar(id: number) {
    this.router.navigate(['/empresa/vacante/editar', id]);
  }

  nuevaVacante() {
    this.router.navigate(['/empresa/vacante/nueva']);
  }
}
