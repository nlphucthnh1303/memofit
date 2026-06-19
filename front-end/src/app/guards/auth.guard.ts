import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
        const isOtpVerify = localStorage.getItem('is_otp_verified');
        if (isOtpVerify === 'true') {
            return true;
        }
    }
    router.navigate(['/otp']);
    return false;
};