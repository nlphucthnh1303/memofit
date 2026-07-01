import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation()
    ),
    provideAnimationsAsync(),
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }))
  ],
};

