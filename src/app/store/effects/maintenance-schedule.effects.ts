import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { StatusMaintenanceScheduleEnum } from 'src/app/models';
import { MaintenanceScheduleService } from 'src/app/service';
import * as maintenanceScheduleActions from 'src/app/store/actions/maintenance-schedule.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class MaintenanceScheduleEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected maintenanceScheduleService: MaintenanceScheduleService) {
    super(injector);
  }

  searchMaintenanceSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(maintenanceScheduleActions.searchMaintenanceSchedule),
      withLatestFrom(this.store$.select((state) => state.maintenanceState)),
      mergeMap(([, { params }]) =>
        this.maintenanceScheduleService
          .searchByStatus(params, [
            this.getKeyByValueEnum(StatusMaintenanceScheduleEnum, StatusMaintenanceScheduleEnum.Won),
            this.getKeyByValueEnum(StatusMaintenanceScheduleEnum, StatusMaintenanceScheduleEnum.Scheduled),
          ])
          .pipe(
            map((data) => maintenanceScheduleActions.searchMaintenanceScheduleSuccess({ data })),
            catchError((error) => {
              this.errorHandler.handle(error);
              return of(maintenanceScheduleActions.searchMaintenanceScheduleError());
            }),
          ),
      ),
    ),
  );

  createMaintenanceSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(maintenanceScheduleActions.createMaintenanceSchedule),
      exhaustMap(({ payload }) =>
        this.maintenanceScheduleService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(maintenanceScheduleActions.searchMaintenanceSchedule());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return maintenanceScheduleActions.createMaintenanceScheduleSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(maintenanceScheduleActions.createMaintenanceScheduleError());
          }),
        ),
      ),
    ),
  );

  updateMaintenanceSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(maintenanceScheduleActions.updateMaintenanceSchedule),
      mergeMap(({ uuid, payload }) =>
        this.maintenanceScheduleService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(maintenanceScheduleActions.searchMaintenanceSchedule());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return maintenanceScheduleActions.updateMaintenanceScheduleSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(maintenanceScheduleActions.updateMaintenanceScheduleError());
          }),
        ),
      ),
    ),
  );

  deleteMaintenanceSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(maintenanceScheduleActions.deleteMaintenanceSchedule),
      mergeMap(({ payload }) =>
        this.maintenanceScheduleService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(maintenanceScheduleActions.searchMaintenanceSchedule());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return maintenanceScheduleActions.deleteMaintenanceScheduleSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(maintenanceScheduleActions.deleteMaintenanceScheduleError());
          }),
        ),
      ),
    ),
  );
}
