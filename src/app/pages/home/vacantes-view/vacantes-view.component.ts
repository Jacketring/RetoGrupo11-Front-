import { Component, OnInit } from '@angular/core';
import { VacanteService } from '../../../services/vacante.service';
import { VacanteResponseDto } from '../../../interfaces/vacante-response-dto';
import { VacantesCardComponent } from '../../../Components/vacantes-card/vacantes-card.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-vacantes-view',
  standalone: true,
  imports: [CommonModule,VacantesCardComponent],
  templateUrl: './vacantes-view.component.html',
})
export class VacantesViewComponent implements OnInit {
  
  vacantes: VacanteResponseDto[] = [];

  constructor(private vacanteService: VacanteService) {}

  ngOnInit(): void {
    console.log('VacantesViewComponent cargado'); // 👈 prueba 1
    this.vacanteService.getTodas().subscribe({
      next: (data) => {
        console.log('Vacantes recibidas:', data); // 👈 prueba 2
        this.vacantes = data;
        console.log(this.vacantes)
      },
      error: (err) => console.error('Error cargando vacantes', err),
    });
  }
}