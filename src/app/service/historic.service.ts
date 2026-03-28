import { Injectable, Injector } from '@angular/core';

import { Historic } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class HistoricService extends BaseResourceService<Historic.Input> {
  constructor(protected override injector: Injector) {
    super('v1/historic', injector);
  }
}
