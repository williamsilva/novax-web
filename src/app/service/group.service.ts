import { Injectable, Injector } from '@angular/core';

import { Group } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService extends BaseResourceService<Group.Input> {
  constructor(protected override injector: Injector) {
    super('v1/groups', injector);
  }
}
