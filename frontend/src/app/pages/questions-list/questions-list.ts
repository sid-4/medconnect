import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { AuthService } from '../../services/auth.service';
import { QuestionCard } from '../../components/question-card/question-card';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [FormsModule, QuestionCard],
  templateUrl: './questions-list.html'
})
export class QuestionsList implements OnInit {
  questions: any[] = [];
  showForm = false;
  newTitle = '';
  newDescription = '';

  constructor(
    private questionService: QuestionService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getAll().subscribe(data => this.questions = data);
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  createQuestion() {
    if (!this.newTitle || !this.newDescription) return;
    this.questionService.create({ title: this.newTitle, description: this.newDescription }).subscribe(() => {
      this.newTitle = '';
      this.newDescription = '';
      this.showForm = false;
      this.loadQuestions();
    });
  }
}
