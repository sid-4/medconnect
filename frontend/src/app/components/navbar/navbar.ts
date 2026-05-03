import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  constructor(
    public authService: AuthService,
    public socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.socketService.connect();
    }
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  logout() {
    this.authService.logout();
    this.socketService.disconnect();
    this.router.navigate(['/login']);
  }

  clearNotifications() {
    this.socketService.clearNotifications();
  }
}
