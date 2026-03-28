import { Injectable, Injector } from '@angular/core';

import { MaintenanceSchedule } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceScheduleService extends BaseResourceService<MaintenanceSchedule.Input> {
  constructor(protected override injector: Injector) {
    super('v1/maintenance-schedule', injector);
  }
}
