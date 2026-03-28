import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { CancellationReason } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class VouchersCancellationReasonService extends BaseResourceService<CancellationReason.Input> {
  constructor(protected override injector: Injector) {
    super('v1/cancellation-reason', injector);
  }

  public searchVouchersCancellationReason() {
    return this.http.get(`${this.apiPathUrl}`).pipe(map(this.extractData));
  }
}
