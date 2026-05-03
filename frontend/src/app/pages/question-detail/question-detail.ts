import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { QuestionService } from '../../services/question.service';
import { AnswerService } from '../../services/answer.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { AnswerList } from '../../components/answer-list/answer-list';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [FormsModule, DatePipe, AnswerList],
  templateUrl: './question-detail.html'
})
export class QuestionDetail implements OnInit {
  question: any = null;
  answers: any[] = [];
  newAnswer = '';
  isEditing = false;
  editTitle = '';
  editDescription = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private answerService: AnswerService,
    public authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadQuestion(id);
    this.loadAnswers(id);

    this.socketService.onNewAnswer((data: any) => {
      if (data.questionId === id) {
        this.loadAnswers(id);
      }
    });
  }

  loadQuestion(id: string) {
    this.questionService.getById(id).subscribe(data => {
      this.question = data;
      this.editTitle = data.title;
      this.editDescription = data.description;
    });
  }

  loadAnswers(id: string) {
    this.answerService.getByQuestion(id).subscribe(data => this.answers = data);
  }

  submitAnswer() {
    if (!this.newAnswer.trim()) return;
    this.answerService.create({ content: this.newAnswer, questionId: this.question._id }).subscribe(() => {
      this.newAnswer = '';
      this.loadAnswers(this.question._id);
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveEdit() {
    this.questionService.update(this.question._id, {
      title: this.editTitle,
      description: this.editDescription
    }).subscribe(updated => {
      this.question = updated;
      this.isEditing = false;
    });
  }

  deleteQuestion() {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.delete(this.question._id).subscribe(() => {
        this.router.navigate(['/questions']);
      });
    }
  }

  isOwner(): boolean {
    return this.authService.currentUser()?.id === this.question?.author?._id;
  }
}
