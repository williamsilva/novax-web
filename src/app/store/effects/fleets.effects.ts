import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { FleetsService } from 'src/app/service';
import * as fleetsActions from '../actions/fleets.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class FleetsEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected fleetsService: FleetsService) {
    super(injector);
  }

  searchLastArrivalDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetsActions.searchLastArrivalDate),
      withLatestFrom(this.store$.select((state) => state.fleetsState)),
      mergeMap(() =>
        this.fleetsService.searchLastArrivalDate().pipe(
          map((lastArrivalDate) => fleetsActions.searchLastArrivalDateSuccess({ lastArrivalDate })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(fleetsActions.searchLastArrivalDateError());
          }),
        ),
      ),
    ),
  );

  searchLastKm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetsActions.searchLastKm),
      withLatestFrom(this.store$.select((state) => state.fleetsState)),
      mergeMap(() =>
        this.fleetsService.searchLastKm().pipe(
          map((lastKm) => fleetsActions.searchLastKmSuccess({ lastKm })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(fleetsActions.searchLastKmError());
          }),
        ),
      ),
    ),
  );

  searchFleets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetsActions.searchFleets),
      withLatestFrom(this.store$.select((state) => state.fleetsState)),
      mergeMap(([, { params }]) =>
        this.fleetsService.search(params).pipe(
          map((data) => fleetsActions.searchFleetsSuccess({ data })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(fleetsActions.searchFleetsError());
          }),
        ),
      ),
    ),
  );

  createFleets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetsActions.createFleets),
      exhaustMap(({ payload }) =>
        this.fleetsService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(fleetsActions.searchFleets());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return fleetsActions.createFleetsSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(fleetsActions.createFleetsError());
          }),
        ),
      ),
    ),
  );

  updateFleets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetsActions.updateFleets),
      mergeMap(({ id, payload }) =>
        this.fleetsService.updateById(id, payload).pipe(
          map(() => {
            this.store$.dispatch(fleetsActions.searchFleets());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return fleetsActions.updateFleetsSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(fleetsActions.updateFleetsError());
          }),
        ),
      ),
    ),
  );

  deleteFleets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetsActions.deleteFleets),
      mergeMap(({ payload }) =>
        this.fleetsService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(fleetsActions.searchFleets());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return fleetsActions.deleteFleetsSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(fleetsActions.deleteFleetsError());
          }),
        ),
      ),
    ),
  );
}
