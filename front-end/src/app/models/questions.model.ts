export enum QuestionMode {
    LISTEN_TYPE_MEANING = 'LISTEN_TYPE_MEANING',
    LISTEN_TYPE_WORD = 'LISTEN_TYPE_WORD',
    SEE_WORD_TYPE_MEANING = 'SEE_WORD_TYPE_MEANING',
    SEE_MEANING_TYPE_WORD = 'SEE_MEANING_TYPE_WORD',
    CLOZE_TEST = 'CLOZE_TEST',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
}

export class Questions {
    id: number | undefined;
    vocabulary_id: number | undefined;
    question_type: QuestionMode | undefined;
    question_text: string | undefined;
    correct_answer: string | undefined;
    wrong_answers: any | undefined;
    is_ai_generated: boolean | undefined;
    is_approved: boolean | undefined;
    created_at: Date | undefined;
    is_delete: string | undefined;

    constructor(init?: Partial<Questions>) {
        if (init) {
            this.id = init.id;
            this.vocabulary_id = init.vocabulary_id;
            this.question_type = init.question_type;
            this.question_text = init.question_text;
            this.correct_answer = init.correct_answer;
            this.wrong_answers = init.wrong_answers;
            this.is_ai_generated = init.is_ai_generated ?? false;
            this.is_approved = init.is_approved ?? true;
            this.created_at = init.created_at ?? new Date();
            this.is_delete = init.is_delete ?? '0';
        }
    }
}
