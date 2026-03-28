import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { StatusMaintenanceEnum } from 'src/app/models';
import { MaintenanceService } from 'src/app/service';
import * as maintenanceActions from 'src/app/store/actions/maintenance.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class MaintenanceEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected maintenanceService: MaintenanceService) {
    super(injector);
  }

  searchMaintenance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(maintenanceActions.searchMaintenance),
      withLatestFrom(this.store$.select((state) => state.maintenanceState)),
      mergeMap(([, { params }]) =>
        this.maintenanceService
          .searchByStatus(params, [
            this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Budget),
            this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Proposal),
            this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Approved),
            this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Concerted),
          ])
          .pipe(
            map((data) => maintenanceActions.searchMaintenanceSuccess({ data })),
            catchError((error) => {
              this.errorHandler.handle(error);
              return of(maintenanceActions.searchMaintenanceError());
            }),
          ),
      ),
    ),
  );

  createMaintenance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(maintenanceActions.createMaintenance),
      exhaustMap(({ payload }) =>
        this.maintenanceService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(maintenanceActions.searchMaintenance());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return maintenanceActions.createMaintenanceSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(maintenanceActions.createMaintenanceError());
          }),
        ),
      ),
    ),
  );

  updateMaintenance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(maintenanceActions.updateMaintenance),
      mergeMap(({ uuid, payload }) =>
        this.maintenanceService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(maintenanceActions.searchMaintenance());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return maintenanceActions.updateMaintenanceSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(maintenanceActions.updateMaintenanceError());
          }),
        ),
      ),
    ),
  );

  deleteMaintenance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(maintenanceActions.deleteMaintenance),
      mergeMap(({ payload }) =>
        this.maintenanceService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(maintenanceActions.searchMaintenance());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return maintenanceActions.deleteMaintenanceSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(maintenanceActions.deleteMaintenanceError());
          }),
        ),
      ),
    ),
  );
}
