export class Users {
    username: string | undefined;
    email: string | undefined;
    password_hash: string | undefined;
    current_streak: number | undefined;
    longest_streak: number | undefined;
    last_active_date: Date | undefined;
    is_delete: string | undefined;
    isOtpVerify: boolean | undefined;

    constructor(init?: Partial<Users>) {
        if (init) {
            this.username = init.username;
            this.email = init.email;
            this.password_hash = init.password_hash;
            this.current_streak = init.current_streak ?? 0; // Đặt giá trị mặc định nếu muốn
            this.longest_streak = init.longest_streak ?? 0;
            this.last_active_date = init.last_active_date ?? new Date();
            this.is_delete = init.is_delete ?? '0';
            this.isOtpVerify = init.isOtpVerify ?? false;
        }
    }

}