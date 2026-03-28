import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';
import { PoolParameters } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class PoolParametersService extends BaseResourceService<PoolParameters.Input> {
  constructor(protected override injector: Injector) {
    super('v1/pool-parameters', injector);
  }

  public searchByShift(shift: string[]) {
    return this.http.get(`${this.apiPathUrl}/shift/${shift}`).pipe(map(this.extractData));
  }
}
