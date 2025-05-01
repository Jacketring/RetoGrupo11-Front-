import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { VacanteResponseDto } from '../../interfaces/vacante-response-dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vacante-botonera',
  imports: [RouterModule],
  templateUrl: './vacantes-botonera.component.html',
  styleUrls: ['./vacantes-botonera.component.css']
})
export class VacanteBotoneraComponent {
  @Input() vacante!: VacanteResponseDto;

  auth = inject(AuthService);
  router = inject(Router);

  verDetalle() {
    console.log('verDetalle() llamado');
    this.router.navigate(['/home/detalle-vacante', this.vacante.idVacante]);
  }

  editar() {
    this.router.navigate(['/empresa/vacante/editar', this.vacante.idVacante]);
  }

  cancelar() {
    alert('🚫 Cancelar vacante (aún no implementado)');
  }

  postular() {
    this.router.navigate(['/cliente/aplicar', this.vacante.idVacante]);
  }
}
