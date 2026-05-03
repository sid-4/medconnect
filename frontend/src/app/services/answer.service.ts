import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnswerService {
  private url = `${environment.apiUrl}/answers`;

  constructor(private http: HttpClient) {}

  getByQuestion(questionId: string) {
    return this.http.get<any[]>(`${this.url}?questionId=${questionId}`);
  }

  create(data: { content: string; questionId: string }) {
    return this.http.post<any>(this.url, data);
  }

  update(id: string, data: { content: string }) {
    return this.http.put<any>(`${this.url}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
