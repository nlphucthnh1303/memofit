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
            this.id = init.id;
            this.session_id = init.session_id;
            this.vocabulary_id = init.vocabulary_id;
            this.question_id = init.question_id;
            this.user_answer = init.user_answer;
            this.is_correct = init.is_correct;
            this.sm2_score = init.sm2_score;
            this.response_time_ms = init.response_time_ms;
            this.created_at = init.created_at ?? new Date();
            this.is_delete = init.is_delete ?? '0';
        }
    }
}
