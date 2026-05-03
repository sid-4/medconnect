import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;
  currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  signup(data: { username: string; email: string; password: string }) {
    return this.http.post<any>(`${this.url}/signup`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.url}/login`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  getMe() {
    return this.http.get<any>(`${this.url}/me`);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setSession(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }
}
