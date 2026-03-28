import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Group } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class GroupPermissionService extends BaseResourceService<Group.Permission> {
  constructor(protected override injector: Injector) {
    super('v1/groups', injector);
  }

  searchPermissionInGroup(id: number) {
    return this.http.get(`${this.apiPathUrl}/${id}/permissions/in-group`).pipe(map(this.extractData));
  }

  searchAvailablePermissions(id: number) {
    return this.http.get(`${this.apiPathUrl}/${id}/permissions/available-permissions`).pipe(map(this.extractData));
  }

  public associationMultiple(groupId: number, permissionsIds: number[]) {
    return this.http.put(`${this.apiPathUrl}/${groupId}/permissions/association`, permissionsIds).pipe(map(() => null));
  }

  public disassociateMultiple(groupId: number, permissionsIds: number[]) {
    return this.http
      .put(`${this.apiPathUrl}/${groupId}/permissions/disassociate`, permissionsIds)
      .pipe(map(() => null));
  }
}
