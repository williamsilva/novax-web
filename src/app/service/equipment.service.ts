import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Equipment } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService extends BaseResourceService<Equipment.Input> {
  constructor(protected override injector: Injector) {
    super('v1/equipment', injector);
  }

  public searchPatrimony(patrimony: number) {
    return this.http.get(`${this.apiPathUrl}/patrimony/${patrimony}`).pipe(map(this.extractData));
  }
}
