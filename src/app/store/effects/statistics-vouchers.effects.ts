import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { StatisticsVouchersService } from 'src/app/service/statistics-vouchers.service';
import * as statisticsActions from '../actions/statistics-voucher.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class StatisticsVoucherEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected statisticsService: StatisticsVouchersService) {
    super(injector);
  }

  totalVouchers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statisticsActions.totalVouchers),
      withLatestFrom(this.store$.select((state) => state.statisticsVouchersState)),
      mergeMap(([, { filter }]) =>
        this.statisticsService.totalVouchers(filter).pipe(
          map((vouchersTotalDTO) => statisticsActions.totalVouchersSuccess({ vouchersTotalDTO })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statisticsActions.totalVouchersError());
          }),
        ),
      ),
    ),
  );

  topClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statisticsActions.topClients),
      withLatestFrom(this.store$.select((state) => state.statisticsVouchersState)),
      mergeMap(([, { topClientsFilter }]) =>
        this.statisticsService.topClients(topClientsFilter).pipe(
          map((topClients) => statisticsActions.topClientsSuccess({ topClients })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statisticsActions.topClientsError());
          }),
        ),
      ),
    ),
  );

  byStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statisticsActions.byStatus),
      withLatestFrom(this.store$.select((state) => state.statisticsVouchersState)),
      mergeMap(([, { byStatusFilter }]) =>
        this.statisticsService.byStatus(byStatusFilter).pipe(
          map((byStatus) => statisticsActions.byStatusSuccess({ byStatus })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statisticsActions.byStatusError());
          }),
        ),
      ),
    ),
  );
}
