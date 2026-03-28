import { HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { City } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class CityService extends BaseResourceService<City.Input> {
  constructor(protected override injector: Injector) {
    super('v1/cities', injector);
  }

  public searchCityByUf(state: string) {
    const params = new HttpParams().append('state', state);

    return this.http.get(`${this.apiPathUrl}/state`, { params }).pipe(map(this.extractData));
  }

  public searchNameAndState(state: string, city: string) {
    const params = new HttpParams({
      fromObject: {
        name: city,
        state: state,
      },
    });

    return this.http.get(`${this.apiPathUrl}/name-and-state`, { params }).pipe(map(this.extractData));
  }
}
