import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { StatusEnum } from 'src/app/models';
import { VouchersCancellationReasonService } from 'src/app/service';
import * as reasonActions from '../actions/cancellation-reason.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class VouchersCancellationReasonsEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected service: VouchersCancellationReasonService) {
    super(injector);
  }

  searchAllReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reasonActions.searchAllReason),
      withLatestFrom(this.store$.select((state) => state.cancellationReasonState)),
      mergeMap(() =>
        this.service.searchVouchersCancellationReason().pipe(
          map((reasons) => reasonActions.searchAllReasonSuccess({ reasons })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(reasonActions.searchAllReasonError());
          }),
        ),
      ),
    ),
  );

  searchReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reasonActions.searchReason),
      withLatestFrom(this.store$.select((state) => state.cancellationReasonState)),
      mergeMap(([, { params }]) =>
        this.service.searchByStatus(params, [this.getKeyByValueEnum(StatusEnum, StatusEnum.Active)]).pipe(
          map((data) => reasonActions.searchReasonSuccess({ data })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(reasonActions.searchReasonError());
          }),
        ),
      ),
    ),
  );

  createReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reasonActions.createReason),
      exhaustMap(({ payload }) =>
        this.service.create(payload).pipe(
          map(() => {
            this.store$.dispatch(reasonActions.searchReason());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return reasonActions.createReasonSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(reasonActions.createReasonError());
          }),
        ),
      ),
    ),
  );

  updateReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reasonActions.updateReason),
      mergeMap(({ id, payload }) =>
        this.service.updateById(id, payload).pipe(
          map(() => {
            this.store$.dispatch(reasonActions.searchReason());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return reasonActions.updateReasonSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(reasonActions.updateReasonError());
          }),
        ),
      ),
    ),
  );

  deleteReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reasonActions.deleteReason),
      mergeMap(({ payload }) =>
        this.service.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(reasonActions.searchReason());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return reasonActions.deleteReasonSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(reasonActions.deleteReasonError());
          }),
        ),
      ),
    ),
  );
}
