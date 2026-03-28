import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { EmployeeService } from 'src/app/service';
import * as agentsActions from '../actions/agents.actions';
import * as employeesActions from '../actions/employees.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class EmployeesEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected employeeService: EmployeeService) {
    super(injector);
  }

  searchAllEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(employeesActions.searchAllEmployee),
      withLatestFrom(this.store$.select((state) => state.employeeState)),
      mergeMap(() =>
        this.employeeService.searchEmployee().pipe(
          map((allEmployees) => employeesActions.searchAllEmployeeSuccess({ allEmployees })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(employeesActions.searchAllEmployeeError());
          }),
        ),
      ),
    ),
  );

  searchEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(employeesActions.searchEmployees),
      withLatestFrom(this.store$.select((state) => state.employeeState)),
      mergeMap(() =>
        this.employeeService.searchEmployee().pipe(
          map((employee) => employeesActions.searchEmployeesSuccess({ employee })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(employeesActions.searchEmployeesError());
          }),
        ),
      ),
    ),
  );

  activationEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(employeesActions.activationEmployee),
      mergeMap(({ payload }) =>
        this.employeeService.activation(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return employeesActions.activationEmployeeSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(employeesActions.activationEmployeeError());
          }),
        ),
      ),
    ),
  );

  deactivateEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(employeesActions.deactivateEmployee),
      mergeMap(({ payload }) =>
        this.employeeService.deactivate(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return employeesActions.deactivateEmployeeSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(employeesActions.deactivateEmployeeError());
          }),
        ),
      ),
    ),
  );
}
