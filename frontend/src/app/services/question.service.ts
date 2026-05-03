import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private url = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.url);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  create(data: { title: string; description: string }) {
    return this.http.post<any>(this.url, data);
  }

  update(id: string, data: { title: string; description: string }) {
    return this.http.put<any>(`${this.url}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
