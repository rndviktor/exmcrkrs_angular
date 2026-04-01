import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold, Check, Edit, Highlighter,
  Italic,
  LucideAngularModule,
  Strikethrough,
  Underline, XCircle
} from "lucide-angular";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Bold, Italic, Underline, Strikethrough,
        AlignLeft, AlignCenter, AlignRight,
        Highlighter, Check, XCircle, Edit
      })
    ),
  ]
};
