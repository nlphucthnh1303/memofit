import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const autoLoginGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const storageType = localStorage.getItem('storage_type');
    const storage = storageType === 'session' ? sessionStorage : localStorage;
    const userLoginStr = storage.getItem('user_login');
    const isOtpVerify = storage.getItem('is_otp_verified') === 'true';

    if (userLoginStr) {
        try {
            const parsedData = JSON.parse(userLoginStr);

            if ((parsedData?.token || parsedData?.user?.token) && isOtpVerify) {
                router.navigate(['/dashboard/overview']);
                return false;
            }
        } catch (e) {
            console.error('Dữ liệu login cũ bị lỗi định dạng:', e);
        }
    }
    return true;
};