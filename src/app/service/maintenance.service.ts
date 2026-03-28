import { Injectable, Injector } from '@angular/core';

import { Maintenance } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService extends BaseResourceService<Maintenance.Input> {
  constructor(protected override injector: Injector) {
    super('v1/maintenance', injector);
  }
}
