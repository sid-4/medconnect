import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AnswerService } from '../../services/answer.service';

@Component({
  selector: 'app-answer-list',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './answer-list.html'
})
export class AnswerList {
  @Input() answers: any[] = [];
  @Output() answerUpdated = new EventEmitter<void>();

  editingId: string | null = null;
  editContent = '';

  constructor(
    public authService: AuthService,
    private answerService: AnswerService
  ) {}

  startEdit(answer: any) {
    this.editingId = answer._id;
    this.editContent = answer.content;
  }

  cancelEdit() {
    this.editingId = null;
    this.editContent = '';
  }

  saveEdit(id: string) {
    this.answerService.update(id, { content: this.editContent }).subscribe(() => {
      this.editingId = null;
      this.answerUpdated.emit();
    });
  }

  deleteAnswer(id: string) {
    if (confirm('Are you sure you want to delete this answer?')) {
      this.answerService.delete(id).subscribe(() => {
        this.answerUpdated.emit();
      });
    }
  }
}
