import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const storageType = localStorage.getItem('storage_type');
    const storage = storageType === 'session' ? sessionStorage : localStorage;

    const isOtpVerify = storage.getItem('is_otp_verified');
    const userLoginStr = storage.getItem('user_login');

    let hasToken = false;

    if (userLoginStr) {
        try {
            const parsedData = JSON.parse(userLoginStr);
            if (parsedData?.token || parsedData?.user?.token) {
                hasToken = true;
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (hasToken) {
        if (isOtpVerify === 'true') {
            return true;
        }
        router.navigate(['/otp']);
        return false;
    }

    // Nếu không có Token trên trình duyệt, chuyển về Login an toàn
    // router.navigate(['/login']);
    return false;
};