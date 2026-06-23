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

    constructor(init?: Partial<QuizSessions>) {
        if (init) {
            this.id = init.id;
            this.user_id = init.user_id;
            this.mode = init.mode ?? SessionMode.NORMAL;
            this.started_at = init.started_at ?? new Date();
            this.ended_at = init.ended_at;
            this.is_delete = init.is_delete ?? '0';
        }
    }
}
