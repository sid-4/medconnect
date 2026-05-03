import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'questions', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'questions', loadComponent: () => import('./pages/questions-list/questions-list').then(m => m.QuestionsList) },
  { path: 'questions/:id', loadComponent: () => import('./pages/question-detail/question-detail').then(m => m.QuestionDetail), canActivate: [authGuard] },
];
