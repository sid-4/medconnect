import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signup({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/questions']),
      error: (err) => this.error = err.error?.message || 'Registration failed.'
    });
  }
}
