import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Location } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService extends BaseResourceService<Location.Input> {
  constructor(protected override injector: Injector) {
    super('v1/location', injector);
  }

  public searchAllLocation() {
    return this.http.get(`${this.apiPathUrl}/all`).pipe(map(this.extractData));
  }
}
