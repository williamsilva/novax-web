import { HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { StatisticsFilter } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsEquipmentsService extends BaseResourceService<StatisticsFilter> {
  constructor(protected override injector: Injector) {
    super('v1/statistics-equipments', injector);
  }

  public totalEquipments(filter?: StatisticsFilter) {
    let params = new HttpParams({});
    params = params.append('filters', JSON.stringify(this.setParamsFilter(filter)));

    return this.http.get(`${this.apiPathUrl}/total-equipments`, { params }).pipe(map(this.extractData));
  }

  public totalMaintenances(filter?: StatisticsFilter) {
    let params = new HttpParams({});
    params = params.append('filters', JSON.stringify(this.setParamsFilter(filter)));

    return this.http.get(`${this.apiPathUrl}/total-maintenances`, { params }).pipe(map(this.extractData));
  }

  public topEquipments(filter?: StatisticsFilter) {
    let params = new HttpParams({});
    params = params.append('filters', JSON.stringify(this.setParamsFilter(filter)));

    return this.http.get(`${this.apiPathUrl}/top-equipments`, { params }).pipe(map(this.extractData));
  }

  public byStatusEquipments(filter: StatisticsFilter) {
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
