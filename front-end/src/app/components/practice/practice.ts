import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-practice',
  imports: [RouterLink, Sidebar],
  templateUrl: './practice.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Practice {
  layout = inject(LayoutService);
  
  currentView = signal<'list' | 'session'>('list');
  activeFilter = signal<'ALL' | 'IT' | 'GRAMMAR' | 'BUSINESS'>('ALL');
  
  // Practice session state
  sessionType = signal<'cloze' | 'listen_meaning' | 'listen_type' | 'multiple_choice' | 'meaning_word' | 'word_meaning'>('cloze');
  isAnswerRevealed = signal<boolean>(false);
  
  tests = [
               {
      id: 1,
      title: 'Kiểm tra từ vựng IT',
      questions: 40,
      time: 15,
      difficulty: 'Khó',
      difficultyBars: 3,
    },
    {
      id: 2,
      title: 'Đề ôn tập #01',
      questions: 30,
      time: 10,
      difficulty: 'Dễ',
      difficultyBars: 1,
    },
    {
      id: 3,
      title: 'Idioms & Phrasal Verbs',
      questions: 50,
      time: 25,
      difficulty: 'TB',
      difficultyBars: 2,
    },
    {
      id: 4,
      title: 'Business English Pro',
      questions: 45,
      time: 20,
      difficulty: 'TB',
      difficultyBars: 2,
    }
  ];

  startPractice() {
    this.currentView.set('session');
    this.sessionType.set('cloze'); // Start with the first type
    this.layout.setForceCollapse(true);
  }

  exitPractice() {
    this.currentView.set('list');
    this.layout.setForceCollapse(false);
  }
  
  // Method to cycle through test variants to showcase all designs
  submitAnswer() {
    if (!this.isAnswerRevealed()) {
      this.isAnswerRevealed.set(true);
    } else {
      this.isAnswerRevealed.set(false);
      const types: ('cloze' | 'listen_meaning' | 'listen_type' | 'multiple_choice' | 'meaning_word' | 'word_meaning')[] = ['cloze', 'listen_meaning', 'listen_type', 'multiple_choice', 'meaning_word', 'word_meaning'];
      const currentIndex = types.indexOf(this.sessionType());
      const nextIndex = (currentIndex + 1) % types.length;
      this.sessionType.set(types[nextIndex]);
    }
  }
}

