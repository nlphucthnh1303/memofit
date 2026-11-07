export enum SessionMode {
    NORMAL = 'normal',
    TIME_ATTACK = 'time_attack'
}

export class QuizSessions {
    id: number | undefined;
    user_id: number | undefined;
    mode: SessionMode | undefined;
    started_at: Date | undefined;
    ended_at: Date | undefined;
    is_delete: string | undefined;
    exam_id: number | undefined;

    constructor(init?: Partial<QuizSessions>) {
        if (init) {
            Object.assign(this, init);
        }
        if (!this.mode) this.mode = SessionMode.NORMAL;
        if (!this.started_at) this.started_at = new Date();
        if (!this.is_delete) this.is_delete = '0';
    }
}
