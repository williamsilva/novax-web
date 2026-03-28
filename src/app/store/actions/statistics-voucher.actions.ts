import { createAction, props } from '@ngrx/store';

import { StatisticsFilter, ByStatusDTO, VouchersTopClientsDTO, VouchersTotalDTO } from 'src/app/models';

export const setFilterVouchers = createAction('[Statistics] Filter', props<{ filter?: StatisticsFilter }>());

/* Total Vouchers*/
export const totalVouchers = createAction('[Statistics] Total Vouchers');
export const totalVouchersError = createAction('[Statistics] Total Vouchers Error');
export const totalVouchersSuccess = createAction(
  '[Statistics] Total Vouchers Success',
  props<{ vouchersTotalDTO: VouchersTotalDTO }>(),
);

/* Top Clients*/
export const topClients = createAction('[Statistics] Top Clients');
export const topClientsError = createAction('[Statistics] Top Clients Error');
export const topClientsSuccess = createAction(
  '[Statistics] Top Clients Success',
  props<{ topClients: VouchersTopClientsDTO[] }>(),
);

/* By Status*/
export const byStatus = createAction('[Statistics] By Status');
export const byStatusError = createAction('[Statistics] By Status Error');
export const byStatusSuccess = createAction('[Statistics] By Status Success', props<{ byStatus: ByStatusDTO[] }>());
