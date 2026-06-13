import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-vocabulary',
  imports: [Sidebar],
  templateUrl: './vocabulary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vocabulary {
  currentView = signal<'collections' | 'words'>('collections');
  showImportModal = signal<boolean>(false);
  showCollectionModal = signal<boolean>(false);
  showVocabularyModal = signal<boolean>(false);
  activeStatusFilter = signal<'ALL' | 'MASTERED' | 'REVIEW_SOON'>('ALL');
  
  // Modal Stepper State
  importStep = signal<1 | 2 | 3>(1);

  collections = [
    {
      id: 1,
      title: 'Tiếng Anh Thương Mại',
      description: 'Từ vựng cốt lõi cho các cuộc họp, đàm phán và email trong...',
      wordCount: 142,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Thuật ngữ IT & Lập trình',
      description: 'Tập hợp các khái niệm lập trình, kiến trúc hệ thống và từ vựng...',
      wordCount: 350,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2370&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Giao tiếp Hàng ngày',
      description: 'Các mẫu câu và từ vựng thông dụng để sinh tồn và giao tiếp tự nhiên trong cuộc sống thường...',
      wordCount: 89,
      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2370&auto=format&fit=crop'
    }
  ];

  words = [
    {
      id: 1,
      target: 'Ubiquitous',
      ipa: '/juːˈbɪk.wɪ.təs/',
      type: 'Adj',
      meaning: 'Có mặt ở khắp mọi nơi; phổ biến.',
      example: '"Mobile phones have become ubiquitous in our daily lives."',
      status: 'Mastered', // Mastered, Learning, Review Soon
      nextReview: '14 days',
      progress: 4 // out of 4
    },
    {
      id: 2,
      target: 'Ephemeral',
      ipa: '/ɪˈfem.ər.əl/',
      type: 'Adj',
      meaning: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: '"Fame in the world of rock and pop is largely ephemeral."',
      status: 'Learning',
      nextReview: 'Tomorrow',
      progress: 2
    },
    {
      id: 3,
      target: 'Ephemeral',
      ipa: '/ɪˈfem.ər.əl/',
      type: 'Adj',
      meaning: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: '"Fame in the world of rock and pop is largely ephemeral."',
      status: 'Learning',
      nextReview: 'Tomorrow',
      progress: 2
    },
    {
      id: 4,
      target: 'Ephemeral',
      ipa: '/ɪˈfem.ər.əl/',
      type: 'Adj',
      meaning: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: '"Fame in the world of rock and pop is largely ephemeral."',
      status: 'Learning',
      nextReview: 'Tomorrow',
      progress: 2
    },
    {
      id: 5,
      target: 'Ephemeral',
      ipa: '/ɪˈfem.ər.əl/',
      type: 'Adj',
      meaning: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: '"Fame in the world of rock and pop is largely ephemeral."',
      status: 'Learning',
      nextReview: 'Tomorrow',
      progress: 2
    },
    {
      id: 6,
      target: 'Mitigate',
      ipa: '/ˈmɪt.ɪ.ɡeɪt/',
      type: 'Verb',
      meaning: 'Làm giảm nhẹ, làm dịu bớt (tác hại, cơn đau).',
      example: '"It is unclear how to mitigate the effects of tourism on the island."',
      status: 'Review Soon',
      nextReview: 'Today',
      progress: 1
    }
  ];

  importedWords = [
    { stt: 1, target: 'Resilience', meaning: 'Khả năng phục hồi nhanh chóng', tags: ['IELTS'], status: 'Valid' },
    { stt: 2, target: 'Ephemeral', meaning: 'Phù du, chóng vánh', tags: ['GRE'], status: 'Valid' },
    { stt: 3, target: 'Ubiquitous', meaning: 'Có mặt ở khắp nơi', tags: ['GRE'], status: 'Duplicate' },
    { stt: 4, target: 'Pragmatic', meaning: '-- Thiếu định nghĩa --', tags: ['TOEFL'], status: 'Missing' },
    { stt: 5, target: 'Mitigate', meaning: 'Làm giảm nhẹ, làm dịu', tags: ['IELTS'], status: 'Valid' }
  ];

  openCollection() {
    this.currentView.set('words');
  }

  goBackToCollections() {
    this.currentView.set('collections');
  }

  openImportModal() {
    this.showImportModal.set(true);
    this.importStep.set(2);
  }

  closeImportModal() {
    this.showImportModal.set(false);
  }

  openCollectionModal() {
    this.showCollectionModal.set(true);
  }

  closeCollectionModal() {
    this.showCollectionModal.set(false);
  }

  openVocabularyModal() {
    this.showVocabularyModal.set(true);
  }

  closeVocabularyModal() {
    this.showVocabularyModal.set(false);
  }
}
