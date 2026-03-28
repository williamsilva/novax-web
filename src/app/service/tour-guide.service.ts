import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { TourGuide } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class TourGuideService extends BaseResourceService<TourGuide.Input> {
  constructor(protected override injector: Injector) {
    super('v1/tour-guide', injector);
  }

  public searchTourGuide() {
    return this.http.get(`${this.apiPathUrl}`).pipe(map(this.extractData));
  }
}
