import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VacanteResponseDto } from '../../interfaces/vacante-response-dto';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-vacantes-card',
  imports: [CurrencyPipe],
  templateUrl: './vacantes-card.component.html',
  styleUrl: './vacantes-card.component.css',
  standalone: true
})
export class VacantesCardComponent {
  @Input() vacante!: VacanteResponseDto;

}
