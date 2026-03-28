import { Action, createReducer, on } from '@ngrx/store';

import { StatisticsFilter, VouchersTotalDTO, VouchersTopClientsDTO } from 'src/app/models';
import * as statisticsActions from '../actions/statistics-voucher.actions';

export interface StatisticsVouchersState {
  success: boolean;
  isLoading: boolean;
  filter?: StatisticsFilter;
  byStatusFilter: StatisticsFilter;
  vouchersTotalDTO: VouchersTotalDTO;
  topClientsFilter?: StatisticsFilter;
  topClients: VouchersTopClientsDTO[];
  byStatus: { status: number; total: number }[];
}

export const initialStatisticsVouchersState: StatisticsVouchersState = {
  filter: {},
  byStatus: [],
  success: false,
  topClients: [],
  isLoading: false,
  byStatusFilter: {},
  topClientsFilter: {},
  vouchersTotalDTO: { client: 0, quantity: 0, totalPrice: 0, totalPriceFoods: 0, totalPriceTickets: 0 },
};

export const _statisticsVouchersReducer = createReducer(
  initialStatisticsVouchersState,

  on(statisticsActions.setFilterVouchers, (state, { filter }) => ({ ...state, filter })),

  /* Total Vouchers */
  on(statisticsActions.totalVouchers, (state) => ({ ...state, isLoading: true })),

  on(statisticsActions.totalVouchersSuccess, (state, { vouchersTotalDTO }) => ({
    ...state,
    vouchersTotalDTO,
    isLoading: false,
  })),

  on(statisticsActions.totalVouchersError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Top Clients */
  on(statisticsActions.topClients, (state) => ({ ...state, isLoading: true })),

  on(statisticsActions.topClientsSuccess, (state, { topClients }) => ({
    ...state,
    topClients,
    isLoading: false,
  })),

  on(statisticsActions.topClientsError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* By Status */
  on(statisticsActions.byStatus, (state) => ({ ...state, isLoading: true })),

  on(statisticsActions.byStatusSuccess, (state, { byStatus }) => ({
    ...state,
    byStatus,
    isLoading: false,
  })),

  on(statisticsActions.byStatusError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function statisticsVouchersReducer(
  state: StatisticsVouchersState = initialStatisticsVouchersState,
  actions: Action,
) {
  return _statisticsVouchersReducer(state, actions);
}
