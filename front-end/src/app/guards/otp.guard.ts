import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const otpGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
        const emailTemp = sessionStorage.getItem('email_verify_otp');
        if (emailTemp && emailTemp !== '') {
            return true;
        }
    }
    router.navigate(['/register']);
    return false;
};