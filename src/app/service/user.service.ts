import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { User } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseResourceService<User.Input> {
  constructor(protected override injector: Injector) {
    super('v1/users', injector);
  }

  public searchAll() {
    return this.http.get(`${this.apiPathUrl}/all`).pipe(map(this.extractData));
  }

  public changePassword(resource: User.Input) {
    return this.http.put(`${this.apiPathUrl}/change-password`, resource).pipe(map(() => null));
  }

  public searchExistDocument(document: string) {
    const params = document.replace(/[-.*+?^${}()|[\]\\/]/g, '');
    return this.http.get(`${this.apiPathUrl}/document/${params}`).pipe(map(this.extractData));
  }

  public activateMultiple(usersIds: number[]) {
    return this.http.put(`${this.apiPathUrl}/activation`, usersIds).pipe(map(() => null));
  }

  public deactivateMultiple(usersIds: number[]) {
    return this.http.put(`${this.apiPathUrl}/deactivate`, usersIds).pipe(map(() => null));
  }
}
