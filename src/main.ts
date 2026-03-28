import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideEnvironmentNgxMask, IConfig } from 'ngx-mask';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { JwtHttpInterceptor } from './app/auth/jwt-http-interceptor';
import { appReducers } from './app/store';
import { EffectsArray } from './app/store/effects';
import { environment } from './environments/environment';

export function tokenGetter() {
  return localStorage.getItem('token');
}

const maskConfig: Partial<IConfig> = {
  validation: false,
};

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    MessageService,
    ConfirmationService,
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtHttpInterceptor,
      multi: true,
    },
    provideAnimations(),
    importProvidersFrom(
      HttpClientModule,

      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: environment.tokenAllowedDomains,
          disallowedRoutes: environment.tokenDisallowedRoutes,
        },
      }),

      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      StoreModule.forRoot(appReducers, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        },
      }),
      EffectsModule.forRoot(EffectsArray),
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: environment.production,
        autoPause: false, // Pauses recording actions and state changes when the extension window is not open
      })
    ),
    provideEnvironmentNgxMask(maskConfig),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
  ],
}).catch((err) => console.error(err));
