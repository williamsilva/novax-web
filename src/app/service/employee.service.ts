import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Employee } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends BaseResourceService<Employee.Input> {
  constructor(protected override injector: Injector) {
    super('v1/employees', injector);
  }

  public searchEmployee() {
    return this.http.get(`${this.apiPathUrl}`).pipe(map(this.extractData));
  }
}
