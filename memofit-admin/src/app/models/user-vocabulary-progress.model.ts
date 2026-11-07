export enum StatusType {
    LEARNING = 'learning',
    MASTERED = 'mastered',
    WARNING = 'warning',
    EXPIRED = 'expired'
}

export class UserVocabularyProgress {
    id: number | undefined;
    user_id: number | undefined;
    vocabulary_id: number | undefined;
    repetitions: number | undefined;
    interval_days: number | undefined;
    ease_factor: number | undefined;
    next_review_date: Date | undefined;
    status: StatusType | undefined;
    last_reviewed_at: Date | undefined;
    is_delete: string | undefined;

    constructor(init?: Partial<UserVocabularyProgress>) {
        if (init) {
            this.id = init.id;
            this.user_id = init.user_id;
            this.vocabulary_id = init.vocabulary_id;
            this.repetitions = init.repetitions ?? 0;
            this.interval_days = init.interval_days ?? 0;
            this.ease_factor = init.ease_factor ?? 2.5;
            this.next_review_date = init.next_review_date;
            this.status = init.status ?? StatusType.LEARNING;
            this.last_reviewed_at = init.last_reviewed_at;
            this.is_delete = init.is_delete ?? '0';
        }
    }
}
