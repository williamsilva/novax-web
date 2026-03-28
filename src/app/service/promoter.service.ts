import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Promoter } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class PromoterService extends BaseResourceService<Promoter.Input> {
  constructor(protected override injector: Injector) {
    super('v1/promoters', injector);
  }

  public searchPromoter() {
    return this.http.get(`${this.apiPathUrl}`).pipe(map(this.extractData));
  }
}
