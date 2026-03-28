import { Injectable } from '@angular/core';
import {
  Router,
  UrlTree,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.isAccessTokenInvalid()) {
      return this.auth.renewAccessToken().then(() => {
        if (this.auth.isAccessTokenInvalid()) {
          this.auth.login();
          return false;
        }

        return true;
      });
    } else if (
      route.data['roles'] &&
      !this.auth.hasAnyPermission(route.data['roles'])
    ) {
      this.router.navigate(['/access']);
      return false;
    }
    return true;
  }
}
