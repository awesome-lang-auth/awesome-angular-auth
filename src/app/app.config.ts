import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideAuth } from '@awesome-lang-auth/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    provideAuth({
      apiPrefix: '/api/auth',
      headless: false // default: false (auto-redirects to login). Set to true for manual control.
    }),
  ]
};
