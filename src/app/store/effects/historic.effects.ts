import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { StatusEquipmentEnum } from 'src/app/models';
import { HistoricService } from 'src/app/service';
import * as historicActions from 'src/app/store/actions/historic.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class HistoricEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected historicService: HistoricService) {
    super(injector);
  }

  searchHistoric$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historicActions.searchHistoric),
      withLatestFrom(this.store$.select((state) => state.historicState)),
      mergeMap(([, { params }]) =>
        this.historicService
          .searchByStatus(params, [
            this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Active),
            this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Maintenance),
          ])
          .pipe(
            map((data) => historicActions.searchHistoricSuccess({ data })),
            catchError((error) => {
              this.errorHandler.handle(error);
              return of(historicActions.searchHistoricError());
            }),
          ),
      ),
    ),
  );

  createHistoric$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historicActions.createHistoric),
      exhaustMap(({ payload }) =>
        this.historicService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(historicActions.searchHistoric());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return historicActions.createHistoricSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(historicActions.createHistoricError());
          }),
        ),
      ),
    ),
  );

  updateHistoric$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historicActions.updateHistoric),
      mergeMap(({ uuid, payload }) =>
        this.historicService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(historicActions.searchHistoric());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return historicActions.updateHistoricSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(historicActions.updateHistoricError());
          }),
        ),
      ),
    ),
  );

  deleteHistoric$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historicActions.deleteHistoric),
      mergeMap(({ payload }) =>
        this.historicService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(historicActions.searchHistoric());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return historicActions.deleteHistoricSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(historicActions.deleteHistoricError());
          }),
        ),
      ),
    ),
  );
}
