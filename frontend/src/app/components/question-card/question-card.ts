import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [RouterLink, DatePipe, SlicePipe],
  templateUrl: './question-card.html'
})
export class QuestionCard {
  @Input() question: any;
}
