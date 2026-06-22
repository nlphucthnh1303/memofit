import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
        const storageType = localStorage.getItem('storage_type');

        let isOtpVerify = localStorage.getItem('is_otp_verified');
        let userLoginStr = localStorage.getItem('user_login');

        if (storageType === 'session' || (!userLoginStr && sessionStorage.getItem('user_login'))) {
            isOtpVerify = sessionStorage.getItem('is_otp_verified');
            userLoginStr = sessionStorage.getItem('user_login');
        }
        let hasToken = false;

        if (userLoginStr) {
            try {
                const parsedData = JSON.parse(userLoginStr);
                if (parsedData && parsedData.token) {
                    hasToken = true;
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (hasToken) {
            if (isOtpVerify === 'true') {
                return true;
            } else {
                router.navigate(['/otp']);
                return false;
            }
        }





        router.navigate(['/login']);
        return false;
    }

    return false;
};