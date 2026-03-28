import { Injectable, Injector } from '@angular/core';

import { Agent } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends BaseResourceService<Agent.Input> {
  constructor(protected override injector: Injector) {
    super('v1/clients', injector);
  }
}
