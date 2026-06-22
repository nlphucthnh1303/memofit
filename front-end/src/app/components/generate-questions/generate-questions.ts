import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-generate-questions',
  imports: [],
  templateUrl: './generate-questions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateQuestions {
  sourceType = signal<'collection' | 'words'>('collection');

  questionCount = signal<number>(15);
  timeLimit = signal<number>(10);

  selectedCollectionId = signal<number | null>(1);
  selectedQuestionType = signal<string>('multiple_choice');

  showReviewModal = signal<boolean>(false);

  collections = [
    {
      id: 1,
      title: 'TOEFL 1000',
      description: '1,240 từ • Từ vựng học thuật'
    },
    {
      id: 2,
      title: 'Thuật ngữ Công nghệ',
      description: '320 từ • Chuyên ngành IT'
    },
    {
      id: 3,
      title: 'Cambridge CAE',
      description: '800 từ • Trình độ C1'
    },
    {
      id: 4,
      title: 'Tin tức hàng ngày',
      description: '450 từ • Cập nhật hôm nay'
    },
    {
      id: 5,
      title: 'Thuật ngữ Công nghệ',
      description: '320 từ • Chuyên ngành IT'
    },
    {
      id: 6,
      title: 'Cambridge CAE',
      description: '800 từ • Trình độ C1'
    }
  ];

  words = [
    {
      id: 1,
      target: 'Consistent',
      meaning: 'Nhất quán, kiên định',
      collection: 'TOEFL 1000',
      selected: true
    },
    {
      id: 2,
      target: 'Evaluate',
      meaning: 'Đánh giá, định giá',
      collection: 'TOEFL 1000',
      selected: true
    },
    {
      id: 3,
      target: 'Artificial Intelligence',
      meaning: 'Trí tuệ nhân tạo',
      collection: 'Công nghệ',
      selected: true
    },
    {
      id: 4,
      target: 'Infrastructure',
      meaning: 'Cơ sở hạ tầng',
      collection: 'Cambridge CAE',
      selected: false
    },
    {
      id: 5,
      target: 'Artificial Intelligence',
      meaning: 'Trí tuệ nhân tạo',
      collection: 'Công nghệ',
      selected: true
    },
    {
      id: 6,
      target: 'Infrastructure',
      meaning: 'Cơ sở hạ tầng',
      collection: 'Cambridge CAE',
      selected: false
    }
  ];

  questionTypes = [
    {
      id: 'listen_meaning',
      title: 'Nghe và gõ ý nghĩa',
      subtitle: 'LISTEN -> TYPE MEANING',
      icon: 'fi-rr-ear'
    },
    {
      id: 'listen_word',
      title: 'Nghe và gõ từ vựng',
      subtitle: 'LISTEN -> TYPE WORD',
      icon: 'fi-rr-keyboard'
    },
    {
      id: 'see_word_meaning',
      title: 'Nhìn từ và gõ ý nghĩa',
      subtitle: 'SEE WORD -> TYPE MEANING',
      icon: 'fi-rr-eye'
    },
    {
      id: 'see_meaning_word',
      title: 'Nhìn ý nghĩa và gõ từ vựng',
      subtitle: 'SEE MEANING -> TYPE WORD',
      icon: 'fi-rr-language'
    },
    {
      id: 'cloze',
      title: 'Điền vào chỗ trống',
      subtitle: 'CLOZE TEST',
      icon: 'fi-rr-edit'
    },
    {
      id: 'multiple_choice',
      title: 'Trắc nghiệm',
      subtitle: 'MULTIPLE CHOICE',
      icon: 'fi-rr-list-check'
    }
  ];

  get selectedWordsCount() {
    return this.words.filter(w => w.selected).length;
  }

  toggleCollection(id: number) {
    this.selectedCollectionId.set(this.selectedCollectionId() === id ? null : id);
  }

  toggleWord(id: number) {
    const word = this.words.find(w => w.id === id);
    if (word) {
      word.selected = !word.selected;
    }
  }

  setTimeLimit(time: number) {
    this.timeLimit.set(time);
  }

  onTypeQuestionCount(event: any) {
    this.questionCount.set(Number(event.target.value));
  }

  onTypeTimeLimit(event: any) {
    this.timeLimit.set(Number(event.target.value));
  }

  openReviewModal() {
    this.showReviewModal.set(true);
  }

  closeReviewModal() {
    this.showReviewModal.set(false);
  }
}
