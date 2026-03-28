import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { wsConsts } from 'src/app/models';
import { ConfigVoucherService } from 'src/app/service';
import * as configVouchersActions from '../actions/config-vouchers.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class ConfigVouchersEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected configVoucherService: ConfigVoucherService) {
    super(injector);
  }

  searchByKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(configVouchersActions.searchByKey),
      withLatestFrom(this.store$.select((state) => state.configVoucherState)),
      mergeMap(([{ key }]) =>
        this.configVoucherService.searchByKey(key).pipe(
          map((config) => configVouchersActions.searchByKeySuccess({ config })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(configVouchersActions.searchByKeyError());
          }),
        ),
      ),
    ),
  );

  updateConfigVouchers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(configVouchersActions.updateConfigVouchers),
      mergeMap(({ key, payload }) =>
        this.configVoucherService.updateByKey(key, payload).pipe(
          map(() => {
            const key = wsConsts.VOUCHER_CHANGE;
            this.store$.dispatch(configVouchersActions.searchByKey({ key }));
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return configVouchersActions.updateConfigVouchersSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(configVouchersActions.updateConfigVouchersError());
          }),
        ),
      ),
    ),
  );
}
