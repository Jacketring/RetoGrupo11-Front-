import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-empresa',
  imports: [RouterModule],
  templateUrl: './home-empresa.component.html',
  styleUrl: './home-empresa.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeEmpresaComponent {

}
