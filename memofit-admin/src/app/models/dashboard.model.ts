export interface DashboardStats {
    totalLearnedVocab: number | undefined;
    totalQuestionsCompleted: number | undefined;
    accuracyPercentage: number | undefined;
    currentStreak: number | undefined;
    longestStreak: number | undefined;
    wordsToReviewToday: number | undefined;
    todayLearnedVocab: number | undefined;
}

export interface DailyProgressPoint {
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
}

export interface VocabularyHealth {
    learning: number;
    mastered: number;
    warning: number;
    expired: number;
    total: number;
    learningPercent: number;
    masteredPercent: number;
    warningPercent: number;
    expiredPercent: number;
}

export interface DailyCorrectIncorrectPoint {
    date: string;
    correct: number;
    incorrect: number;
}

export interface DashboardCharts {
    compareCorrectIncorrect: {
        correct: number | undefined;
        incorrect: number | undefined;
    };
    dailyProgressChart: DailyProgressPoint[];
    vocabularyHealth: VocabularyHealth;
    dailyCorrectIncorrect: DailyCorrectIncorrectPoint[];
}

export interface RecentVocabItem {
    id: number;
    vocabularyId: number | null;
    word: string;
    meaning: string;
    status: 'learning' | 'mastered' | 'warning' | 'expired';
    repetitions: number;
    easeFactor: number;
    nextReviewDate: string | null;
    lastReviewedAt: string | null;
}

export interface DashboardResponse {
    success: boolean ;
    stats: DashboardStats;
    charts: DashboardCharts;
    recentlyReviewed: RecentVocabItem[];
    message?: string;
}