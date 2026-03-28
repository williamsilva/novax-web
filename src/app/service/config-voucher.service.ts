import { HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { ConfigVoucher } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigVoucherService extends BaseResourceService<ConfigVoucher.Input> {
  constructor(protected override injector: Injector) {
    super('v1/config-voucher', injector);
  }

  public searchByKey(key: string) {
    const params = new HttpParams().append('key', key);

    return this.http.get(`${this.apiPathUrl}/key`, { params }).pipe(map(this.extractData));
  }

  public updateByKey(key: string, resource: ConfigVoucher.Model) {
    return this.http.put(`${this.apiPathUrl}/${key}`, resource).pipe(map(this.extractData));
  }
}
