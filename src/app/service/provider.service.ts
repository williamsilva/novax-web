import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Provider } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderService extends BaseResourceService<Provider.Input> {
  constructor(protected override injector: Injector) {
    super('v1/providers', injector);
  }

  public searchProvider() {
    return this.http.get(`${this.apiPathUrl}`).pipe(map(this.extractData));
  }
}
