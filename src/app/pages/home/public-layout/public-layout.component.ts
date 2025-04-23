import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from "../../../Components/navbar/navbar.component";
import { FooterComponent } from "../../../Components/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {

}
