import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  imports: [RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
  standalone: true,
})
export class AdminHomeComponent {

}
