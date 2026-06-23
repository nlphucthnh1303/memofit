export class ExamQuestions {
    id: number | undefined;
    exam_id: number | undefined;
    question_id: number | undefined;
    is_delete: string | undefined;

    constructor(init?: Partial<ExamQuestions>) {
        if (init) {
            this.id = init.id;
            this.exam_id = init.exam_id;
            this.question_id = init.question_id;
            this.is_delete = init.is_delete ?? '0';
        }
    }
}
