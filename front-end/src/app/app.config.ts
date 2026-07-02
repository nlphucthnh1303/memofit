import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideRouter(
      routes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation()
    ),
    provideAnimationsAsync(),
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }))
  ],
};

