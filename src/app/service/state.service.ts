import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { State } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class StateService extends BaseResourceService<State.Input> {
  constructor(protected override injector: Injector) {
    super('v1/states', injector);
  }

  public searchAllState() {
    return this.http.get(`${this.apiPathUrl}/all`).pipe(map(this.extractData));
  }

  public consultPostalCode(cep: string) {
    return this.http.get(`//viacep.com.br/ws/${cep}/json`).pipe(map(this.extractData));
  }
}
