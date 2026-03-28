import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { ChlorineParameters } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class ChlorineParametersService extends BaseResourceService<ChlorineParameters.Input> {
  constructor(protected override injector: Injector) {
    super('v1/chlorine-parameters', injector);
  }

  public searchByShift(shift: number[]) {
    return this.http.get(`${this.apiPathUrl}/shift/${shift}`).pipe(map(this.extractData));
  }
}
