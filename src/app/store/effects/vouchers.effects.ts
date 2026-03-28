import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { StatusVoucherEnum } from 'src/app/models';
import { VoucherService } from 'src/app/service';
import * as vouchersActions from 'src/app/store/actions/vouchers.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class VouchersEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected voucherService: VoucherService) {
    super(injector);
  }

  searchVouchers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.searchVoucher),
      withLatestFrom(this.store$.select((state) => state.voucherState)),
      mergeMap(([, { params }]) =>
        this.voucherService
          .searchByStatus(params, [
            this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Dealing),
            this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Overdue),
            this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Confirmed),
          ])
          .pipe(
            map((data) => vouchersActions.searchVoucherSuccess({ data })),
            catchError((error) => {
              this.errorHandler.handle(error);
              return of(vouchersActions.searchVoucherError());
            }),
          ),
      ),
    ),
  );

  createVouchers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.createVoucher),
      exhaustMap(({ payload }) =>
        this.voucherService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(vouchersActions.searchVoucher());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return vouchersActions.createVoucherSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.createVoucherError());
          }),
        ),
      ),
    ),
  );

  updateVouchers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.updateVoucher),
      mergeMap(({ uuid, payload }) =>
        this.voucherService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(vouchersActions.searchVoucher());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return vouchersActions.updateVoucherSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.updateVoucherError());
          }),
        ),
      ),
    ),
  );

  deleteVouchers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.deleteVoucher),
      mergeMap(({ payload }) =>
        this.voucherService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(vouchersActions.searchVoucher());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return vouchersActions.deleteVoucherSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.deleteVoucherError());
          }),
        ),
      ),
    ),
  );

  confirmVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.confirmVoucher),
      mergeMap(({ payload }) =>
        this.voucherService.confirm(payload).pipe(
          map(() => {
            this.store$.dispatch(vouchersActions.searchVoucher());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return vouchersActions.confirmVoucherSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.confirmVoucherError());
          }),
        ),
      ),
    ),
  );

  notConfirmVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.notConfirmVoucher),
      mergeMap(({ payload }) =>
        this.voucherService.notConfirm(payload).pipe(
          map(() => {
            this.store$.dispatch(vouchersActions.searchVoucher());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return vouchersActions.notConfirmVoucherSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.notConfirmVoucherError());
          }),
        ),
      ),
    ),
  );

  changeVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.changeVoucher),
      mergeMap(({ payload }) =>
        this.voucherService.change(payload).pipe(
          map(() => {
            this.store$.dispatch(vouchersActions.searchVoucher());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return vouchersActions.changeVoucherSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.changeVoucherError());
          }),
        ),
      ),
    ),
  );

  cancelVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.cancelVoucher),
      mergeMap(({ uuid, payload }) =>
        this.voucherService.cancel(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(vouchersActions.searchVoucher());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return vouchersActions.cancelVoucherSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.cancelVoucherError());
          }),
        ),
      ),
    ),
  );

  toSendVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.toSendVoucher),
      mergeMap(({ payload }) =>
        this.voucherService.toSend(payload).pipe(
          map(() => {
            this.store$.dispatch(vouchersActions.searchVoucher());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return vouchersActions.toSendVoucherSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.toSendVoucherError());
          }),
        ),
      ),
    ),
  );

  toViewVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vouchersActions.toViewVoucher),
      mergeMap(({ payload }) =>
        this.voucherService.toView(payload).pipe(
          map((report: Blob) => vouchersActions.toViewVoucherSuccess({ report })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(vouchersActions.toViewVoucherError());
          }),
        ),
      ),
    ),
  );
}
