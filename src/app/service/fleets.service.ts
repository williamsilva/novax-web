import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';
import { Fleets } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class FleetsService extends BaseResourceService<Fleets.Input> {
  constructor(protected override injector: Injector) {
    super('v1/fleets', injector);
  }

  public searchLastKm() {
    return this.http.get(`${this.apiPathUrl}/last-km`).pipe(map(this.extractData));
  }

  public searchLastArrivalDate() {
    return this.http.get(`${this.apiPathUrl}/arrival-date`).pipe(map(this.extractData));
  }
}
