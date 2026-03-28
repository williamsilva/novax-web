import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, from, mergeMap } from 'rxjs';

import { AuthService } from './auth.service';

export class NotAuthenticatedError {}

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      !request.url.includes('/oauth2/token') &&
      !request.url.includes('/oauth2/revoke') &&
      this.auth.isAccessTokenInvalid()
    ) {
      return from(this.auth.renewAccessToken()).pipe(
        mergeMap(() => {
          if (this.auth.isAccessTokenInvalid()) {
            throw new NotAuthenticatedError();
          }

          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          return next.handle(request);
        })
      );
    }

    if (request.url.includes('/oauth2/revoke')) {
      request = request.clone({
        setHeaders: {
          Authorization: this.auth.basicAuth(),
        },
      });
    }

    return next.handle(request);
  }
}
