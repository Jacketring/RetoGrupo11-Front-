import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacanteService } from '../../../services/vacante.service';
import { VacanteResponseDto } from '../../../interfaces/vacante-response-dto';

@Component({
  selector: 'app-detalle-vacante',
  templateUrl: './detalle-vacante.component.html',
  styleUrls: ['./detalle-vacante.component.css'],
})
export class DetalleVacanteComponent implements OnInit {

  @Input() vacante!: VacanteResponseDto;

  constructor(
    private vacanteService: VacanteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idVacante = +this.route.snapshot.paramMap.get('id')!;
    this.vacanteService.getDetalle(idVacante).subscribe({
      next: (data) => {
        this.vacante = data;
        console.log('Vacante cargada:', this.vacante);
      },
      error: (err) => {
        console.error('No se pudo cargar la vacante:', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['vacantes']);  // O la ruta que prefieras
  }
}
