import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Voucher } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class VoucherService extends BaseResourceService<Voucher.Input> {
  constructor(protected override injector: Injector) {
    super('v1/vouchers', injector);
  }

  public confirm(uuid: string) {
    return this.http.put(`${this.apiPathUrl}/${uuid}/confirm`, uuid).pipe(map(() => null));
  }

  public notConfirm(uuid: string) {
    return this.http.put(`${this.apiPathUrl}/${uuid}/not-confirm`, uuid).pipe(map(() => null));
  }

  public change(uuid: string) {
    return this.http.put(`${this.apiPathUrl}/${uuid}/change`, uuid).pipe(map(() => null));
  }

  public cancel(uuid: string, resource: Voucher.CancellationInput) {
    return this.http.put(`${this.apiPathUrl}/${uuid}/cancel`, resource).pipe(map(() => null));
  }

  public toSend(uuid: string) {
    return this.http.put(`${this.apiPathUrl}/${uuid}/send-email`, uuid).pipe(map(() => null));
  }

  public toView(uuid: string) {
    return this.http.get(`${this.apiPathUrl}/${uuid}/to-view`, { responseType: 'blob' }).pipe();
  }
}
