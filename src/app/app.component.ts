import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from "./Components/navbar/navbar.component";
import { FooterComponent } from "./Components/footer/footer.component";
import { JumbotronComponent } from "./Components/jumbotron/jumbotron.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FrontReto11';

  constructor (private router: Router){}

  ngOnInit(): void {
    initFlowbite();

    if (this.router.url === '/') {
      this.router.navigate(['/vacantes']);
    }
  }
}
