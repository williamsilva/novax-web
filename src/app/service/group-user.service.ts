import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { User } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class GroupUserService extends BaseResourceService<User.Model> {
  constructor(protected override injector: Injector) {
    super('v1/groups', injector);
  }

  searchUserInGroup(id: number) {
    return this.http.get(`${this.apiPathUrl}/${id}/users/in-group`).pipe(map(this.extractData));
  }

  searchAvailableUsers(id: number) {
    return this.http.get(`${this.apiPathUrl}/${id}/users/available-users`).pipe(map(this.extractData));
  }

  public associationMultiple(groupId: number, usersIds: number[]) {
    return this.http.put(`${this.apiPathUrl}/${groupId}/users/association`, usersIds).pipe(map(() => null));
  }

  public disassociateMultiple(groupId: number, usersIds: number[]) {
    return this.http.put(`${this.apiPathUrl}/${groupId}/users/disassociate`, usersIds).pipe(map(() => null));
  }
}
