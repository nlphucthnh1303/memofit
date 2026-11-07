export class Exams {
    id: number | undefined;
    title: string | undefined;
    description: string | undefined;
    total_questions: number | undefined;
    time_limit_minutes: number | undefined;
    created_at: Date | undefined;
    is_delete: string | undefined;

    constructor(init?: Partial<Exams>) {
        if (init) {
            this.id = init.id;
            this.title = init.title;
            this.description = init.description;
            this.total_questions = init.total_questions;
            this.time_limit_minutes = init.time_limit_minutes;
            this.created_at = init.created_at ?? new Date();
            this.is_delete = init.is_delete ?? '0';
        }
    }
}
