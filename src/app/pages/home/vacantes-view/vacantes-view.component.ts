import { Component, computed, signal, effect } from '@angular/core';
import { VacanteService } from '../../../services/vacante.service';
import { VacanteResponseDto } from '../../../interfaces/vacante-response-dto';
import { VacantesCardComponent } from '../../../Components/vacantes-card/vacantes-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vacantes-view',
  standalone: true,
  imports: [CommonModule, VacantesCardComponent],
  templateUrl: './vacantes-view.component.html',
})
export class VacantesViewComponent {
  vacantes = signal<VacanteResponseDto[]>([]);

  constructor(private vacanteService: VacanteService) {
    console.log('VacantesViewComponent cargado');

    // Llama al servicio y actualiza la señal
    this.vacanteService.getCreadas().subscribe({
      next: (data) => {
        console.log('Vacantes recibidas:', data);
        this.vacantes.set(data);
      },
      error: (err) => console.error('Error cargando vacantes', err),
    });
  }
}
