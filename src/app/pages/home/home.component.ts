import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userRole: string | null = null;

  ngOnInit(): void {
    this.isAuthenticated();
  }

  isAuthenticated() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userRole = this.authService.getRole();
  }

  logout(): void {
    this.authService.logout();
  }
}
