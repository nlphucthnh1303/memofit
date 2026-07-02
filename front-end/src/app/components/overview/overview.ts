import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardCharts, DashboardStats, RecentVocabItem, VocabularyHealth } from '../../models/dashboard.model';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Streak } from '../streak/streak';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-overview',
  imports: [NgxSpinnerModule, Streak, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Overview implements OnInit {

  dailyProgressData: { day: string; height: number; isCurrent: boolean }[] = [];
  correctVsIncorrectData: { day: string; correct: number; incorrect: number; isToday: boolean }[] = [];
  vocabHealth = signal<VocabularyHealth | undefined>(undefined);
  vocabDonutSegments: { dasharray: string; dashoffset: number; colorClass: string }[] = [];

  private dashboardService = inject(DashboardService);
  private spinner = inject(NgxSpinnerService)
  private cdr = inject(ChangeDetectorRef)
  stats = signal<DashboardStats | undefined>(undefined);
  charts = signal<DashboardCharts | undefined>(undefined);
  recentlyReviewed = signal<RecentVocabItem[]>([]);
  isLoading = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.spinner.show();
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardOverview().subscribe({
      next: (response) => {
        this.cdr.markForCheck();
        if (response.success) {
          this.stats.set(response.stats);
          this.charts.set(response.charts);
          this.buildDailyProgressChart(response.charts);
          this.buildVocabHealthChart(response.charts);
          this.buildCorrectVsIncorrectChart(response.charts);
          this.recentlyReviewed.set(response.recentlyReviewed || []);

          const isEmpty =
            !response.stats.totalLearnedVocab &&
            !response.stats.totalQuestionsCompleted &&
            this.dailyProgressData.length === 0 &&
            this.correctVsIncorrectData.length === 0 &&
            (response.recentlyReviewed || []).length === 0;

          if (isEmpty) {
            this.loadDemoData();
          }
        } else {
          this.loadDemoData();
        }

        setTimeout(() => {
          this.spinner.hide();
        }, 1000)
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
        this.loadDemoData();
        this.cdr.markForCheck();
        this.spinner.hide();
      }
    });
  }


  private loadDemoData(): void {

    this.stats.set({
      totalLearnedVocab: 156,
      totalQuestionsCompleted: 432,
      accuracyPercentage: 78.5,
      currentStreak: 12,
      longestStreak: 21,
      wordsToReviewToday: 8,
      todayLearnedVocab: 14,
    });


    const demoProgressHeights = [35, 55, 45, 80, 65, 90, 50];
    this.dailyProgressData = this.getLast7Days().map((day, i) => ({
      day,
      height: demoProgressHeights[i],
      isCurrent: i === 6,
    }));


    const demoHealth: VocabularyHealth = {
      learning: 42,
      mastered: 68,
      warning: 28,
      expired: 18,
      total: 156,
      learningPercent: 26.9,
      masteredPercent: 43.6,
      warningPercent: 17.9,
      expiredPercent: 11.5,
    };
    this.vocabHealth.set(demoHealth);
    this.buildVocabHealthChart({
      vocabularyHealth: demoHealth,
    } as DashboardCharts);


    const demoCorrect = [60, 75, 50, 85, 70, 90, 65];
    const demoIncorrect = [20, 10, 25, 10, 15, 5, 15];
    const maxDemo = Math.max(...demoCorrect.map((c, i) => c + demoIncorrect[i]), 1);
    this.correctVsIncorrectData = this.getLast7Days().map((day, i) => ({
      day,
      correct: Math.round((demoCorrect[i] / maxDemo) * 100),
      incorrect: Math.round((demoIncorrect[i] / maxDemo) * 100),
      isToday: i === 6,
    }));


    const now = new Date();
    this.recentlyReviewed.set([
      {
        id: 1,
        vocabularyId: 1,
        word: 'Ephemeral',
        meaning: 'Kéo dài trong một thời gian rất ngắn.',
        status: 'mastered',
        repetitions: 3,
        easeFactor: 2.8,
        nextReviewDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastReviewedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        vocabularyId: 2,
        word: 'Ubiquitous',
        meaning: 'Có mặt ở khắp nơi, phổ biến rộng rãi.',
        status: 'mastered',
        repetitions: 4,
        easeFactor: 2.9,
        nextReviewDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastReviewedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        vocabularyId: 3,
        word: 'Cognizant',
        meaning: 'Có kiến thức hoặc nhận thức được.',
        status: 'learning',
        repetitions: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastReviewedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        vocabularyId: 4,
        word: 'Pragmatic',
        meaning: 'Giải quyết vấn đề theo cách thực tế.',
        status: 'warning',
        repetitions: 2,
        easeFactor: 2.2,
        nextReviewDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastReviewedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 5,
        vocabularyId: 5,
        word: 'Eloquent',
        meaning: 'Lưu loát, hùng biện và thuyết phục.',
        status: 'expired',
        repetitions: 0,
        easeFactor: 2.0,
        nextReviewDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastReviewedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);
  }


  private getLast7Days(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
    }
    return days;
  }



  private buildDailyProgressChart(charts: DashboardCharts): void {
    const data = charts.dailyProgressChart;
    if (!data || data.length === 0) {
      this.dailyProgressData = [];
      return;
    }

    const maxQuestions = Math.max(...data.map(d => d.questionsAnswered), 1);
    const todayDateStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

    this.dailyProgressData = data.map(item => ({
      day: item.date,
      height: Math.round((item.questionsAnswered / maxQuestions) * 100),
      isCurrent: item.date === todayDateStr,
    }));
  }


  private buildVocabHealthChart(charts: DashboardCharts): void {
    const health = charts.vocabularyHealth;
    if (!health) return;

    this.vocabHealth.set(health);

    const circumference = 2 * Math.PI * 42;
    const gap = 4;

    const percents = [
      { percent: health.learningPercent, colorClass: 'stroke-blue-700' },
      { percent: health.masteredPercent, colorClass: 'stroke-emerald-700' },
      { percent: health.warningPercent, colorClass: 'stroke-orange-700' },
      { percent: health.expiredPercent, colorClass: 'stroke-red-700' },
    ].filter(s => s.percent > 0);

    let offset = 0;
    this.vocabDonutSegments = percents.map(seg => {
      const arcLength = (seg.percent / 100) * circumference - gap;
      const segment = {
        dasharray: `${Math.max(arcLength, 0)} ${circumference}`,
        dashoffset: -offset,
        colorClass: seg.colorClass,
      };
      offset += (seg.percent / 100) * circumference;
      return segment;
    });
  }


  private buildCorrectVsIncorrectChart(charts: DashboardCharts): void {
    const data = charts.dailyCorrectIncorrect;
    if (!data || data.length === 0) {
      this.correctVsIncorrectData = [];
      return;
    }

    const maxTotal = Math.max(...data.map(d => d.correct + d.incorrect), 1);
    const todayDateStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

    this.correctVsIncorrectData = data.map(item => ({
      day: item.date,
      correct: Math.round((item.correct / maxTotal) * 100),
      incorrect: Math.round((item.incorrect / maxTotal) * 100),
      isToday: item.date === todayDateStr,
    }));
  }

  getProficiencyBars(item: RecentVocabItem): boolean[] {
    const filled = Math.min(item.repetitions, 4);
    return [filled >= 1, filled >= 2, filled >= 3, filled >= 4];
  }

  getProficiencyColor(item: RecentVocabItem): string {
    switch (item.status) {
      case 'mastered': return 'bg-emerald-600';
      case 'learning': return 'bg-blue-600';
      case 'warning': return 'bg-amber-700/80';
      case 'expired': return 'bg-red-600';
      default: return 'bg-slate-400';
    }
  }


  getNextReviewText(item: RecentVocabItem): string {
    if (!item.nextReviewDate) return 'Chưa xác định';

    const now = new Date();
    const reviewDate = new Date(item.nextReviewDate);
    const diffMs = reviewDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Đã quá hạn';
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    return `Trong ${diffDays} ngày nữa`;
  }


  getNextReviewColorClass(item: RecentVocabItem): string {
    if (!item.nextReviewDate) return 'text-slate-500';

    const now = new Date();
    const reviewDate = new Date(item.nextReviewDate);
    const diffMs = reviewDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600 font-bold';
    if (diffDays <= 1) return 'text-red-600 font-bold';
    if (diffDays <= 3) return 'text-amber-600 font-medium';
    return 'text-slate-600 font-medium';
  }
}
