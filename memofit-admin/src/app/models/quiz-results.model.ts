export class QuizResults {
    id: number | undefined;
    session_id: number | undefined;
    vocabulary_id: number | undefined;
    question_id: number | undefined;
    user_answer: string | undefined;
    is_correct: boolean | undefined;
    sm2_score: number | undefined;
    response_time_ms: number | undefined;
    created_at: Date | undefined;
    is_delete: string | undefined;

    constructor(init?: Partial<QuizResults>) {
        if (init) {
            Object.assign(this, init);
        }
        if (!this.created_at) this.created_at = new Date();
        if (!this.is_delete) this.is_delete = '0';
    }
}
