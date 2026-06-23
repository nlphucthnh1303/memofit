export class Collections {
    id: number | undefined;
    user_id: number | undefined;
    title: string | undefined;
    description: string | undefined;
    cover_image: string | undefined;
    created_at: Date | undefined;
    is_delete: string | undefined;

    constructor(init?: Partial<Collections>) {
        if (init) {
            this.id = init.id;
            this.user_id = init.user_id;
            this.title = init.title;
            this.description = init.description;
            this.cover_image = init.cover_image;
            this.created_at = init.created_at ?? new Date();
            this.is_delete = init.is_delete ?? '0';
        }
    }
}
