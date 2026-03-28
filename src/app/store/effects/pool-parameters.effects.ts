import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { PoolParametersService } from 'src/app/service';
import * as poolParametersActions from 'src/app/store/actions/pool-parameters.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class PoolParametersEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected poolParametersService: PoolParametersService) {
    super(injector);
  }

  searchPoolParametersByShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(poolParametersActions.searchPoolParametersByShift),
      withLatestFrom(this.store$.select((state) => state.poolParametersState)),
      mergeMap(([, { shiftParams }]) =>
        this.poolParametersService.searchByShift(shiftParams).pipe(
          map((poolParameters) => poolParametersActions.searchPoolParametersByShiftSuccess({ poolParameters })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(poolParametersActions.searchPoolParametersByShiftError());
          }),
        ),
      ),
    ),
  );

  searchPoolParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(poolParametersActions.searchPoolParameters),
      withLatestFrom(this.store$.select((state) => state.poolParametersState)),
      mergeMap(([, { params }]) =>
        this.poolParametersService.search(params).pipe(
          map((data) => poolParametersActions.searchPoolParametersSuccess({ data })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(poolParametersActions.searchPoolParametersError());
          }),
        ),
      ),
    ),
  );

  createPoolParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(poolParametersActions.createPoolParameters),
      exhaustMap(({ payload }) =>
        this.poolParametersService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(poolParametersActions.searchPoolParameters());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return poolParametersActions.createPoolParametersSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(poolParametersActions.createPoolParametersError());
          }),
        ),
      ),
    ),
  );

  updatePoolParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(poolParametersActions.updatePoolParameters),
      mergeMap(({ uuid, payload }) =>
        this.poolParametersService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(poolParametersActions.searchPoolParameters());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return poolParametersActions.updatePoolParametersSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(poolParametersActions.updatePoolParametersError());
          }),
        ),
      ),
    ),
  );

  deletePoolParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(poolParametersActions.deletePoolParameters),
      mergeMap(({ payload }) =>
        this.poolParametersService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(poolParametersActions.searchPoolParameters());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return poolParametersActions.deletePoolParametersSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(poolParametersActions.deletePoolParametersError());
          }),
        ),
      ),
    ),
  );
}
