import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { ChlorineParametersService } from 'src/app/service';
import * as chlorineParametersActions from 'src/app/store/actions/chlorine-parameters.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class ChlorineParametersEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected chlorineParametersService: ChlorineParametersService) {
    super(injector);
  }

  searchChlorineParametersByShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chlorineParametersActions.searchChlorineParametersByShift),
      withLatestFrom(this.store$.select((state) => state.chlorineParametersState)),
      mergeMap(([, { shiftParams }]) =>
        this.chlorineParametersService.searchByShift(shiftParams).pipe(
          map((chlorineParameters) =>
            chlorineParametersActions.searchChlorineParametersByShiftSuccess({ chlorineParameters }),
          ),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(chlorineParametersActions.searchChlorineParametersByShiftError());
          }),
        ),
      ),
    ),
  );

  searchChlorineParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chlorineParametersActions.searchChlorineParameters),
      withLatestFrom(this.store$.select((state) => state.chlorineParametersState)),
      mergeMap(([, { params }]) =>
        this.chlorineParametersService.search(params).pipe(
          map((data) => chlorineParametersActions.searchChlorineParametersSuccess({ data })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(chlorineParametersActions.searchChlorineParametersError());
          }),
        ),
      ),
    ),
  );

  createChlorineParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chlorineParametersActions.createChlorineParameters),
      exhaustMap(({ payload }) =>
        this.chlorineParametersService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(chlorineParametersActions.searchChlorineParameters());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return chlorineParametersActions.createChlorineParametersSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(chlorineParametersActions.createChlorineParametersError());
          }),
        ),
      ),
    ),
  );

  updateChlorineParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chlorineParametersActions.updateChlorineParameters),
      mergeMap(({ uuid, payload }) =>
        this.chlorineParametersService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(chlorineParametersActions.searchChlorineParameters());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return chlorineParametersActions.updateChlorineParametersSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(chlorineParametersActions.updateChlorineParametersError());
          }),
        ),
      ),
    ),
  );

  deleteChlorineParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chlorineParametersActions.deleteChlorineParameters),
      mergeMap(({ payload }) =>
        this.chlorineParametersService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(chlorineParametersActions.searchChlorineParameters());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return chlorineParametersActions.deleteChlorineParametersSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(chlorineParametersActions.deleteChlorineParametersError());
          }),
        ),
      ),
    ),
  );
}
