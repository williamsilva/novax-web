import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Courtesy } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class CourtesyService extends BaseResourceService<Courtesy.Input> {
  constructor(protected override injector: Injector) {
    super('v1/courtesy', injector);
  }

  public activationCourtesy(uuid: string) {
    return this.http.put(`${this.apiPathUrl}/${uuid}/activation`, '').pipe(map(() => null));
  }

  public deactivateCourtesy(uuid: string) {
    return this.http.delete(`${this.apiPathUrl}/${uuid}/deactivate`).pipe(map(() => null));
  }

  public replacementMultiple(input: Courtesy.ReplacementInput) {
    return this.http.put(`${this.apiPathUrl}/replacement`, input).pipe(map(() => null));
  }
}
