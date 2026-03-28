import { HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { StatisticsFilter } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsVouchersService extends BaseResourceService<StatisticsFilter> {
  constructor(protected override injector: Injector) {
    super('v1/statistics', injector);
  }

  public totalVouchers(filter?: StatisticsFilter) {
    let params = new HttpParams({});
    params = params.append('filters', JSON.stringify(this.setParamsFilter(filter)));

    return this.http.get(`${this.apiPathUrl}/total-vouchers`, { params }).pipe(map(this.extractData));
  }

  public topClients(filter?: StatisticsFilter) {
    let params = new HttpParams({});
    params = params.append('filters', JSON.stringify(this.setParamsFilter(filter)));

    return this.http.get(`${this.apiPathUrl}/top-clients`, { params }).pipe(map(this.extractData));
  }

  public byStatus(filter: StatisticsFilter) {
    let params = new HttpParams({});
    params = params.append('filters', JSON.stringify(this.setParamsFilter(filter)));

    return this.http.get(`${this.apiPathUrl}/by-status`, { params }).pipe(map(this.extractData));
  }

  protected setParamsFilter(params?: StatisticsFilter) {
    if (params) {
      return {
        firstPeriod: params.firstPeriod,
        finalPeriod: params.finalPeriod,
      };
    } else {
      return {
        filters: null,
      };
    }
  }
}
