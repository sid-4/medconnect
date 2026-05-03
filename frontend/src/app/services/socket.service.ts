import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Notification {
  message: string;
  questionId: string;
  answerId: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);

  constructor(private authService: AuthService) {}

  connect() {
    this.socket = io(environment.wsUrl);

    const user = this.authService.currentUser();
    if (user) {
      this.socket.on('connect', () => {
        this.socket.emit('register', user.id);
      });
    }

    this.socket.on('notification:new', (notification: Notification) => {
      this.notifications.update(list => [notification, ...list]);
      this.unreadCount.update(n => n + 1);
    });
  }

  onNewAnswer(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('answer:new', callback);
    }
  }

  clearNotifications() {
    this.unreadCount.set(0);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
