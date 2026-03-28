import { Action, createReducer, on } from '@ngrx/store';
import { ContentProps, EventFilters } from 'src/app/models';

import * as actions from 'src/app/store/actions/vouchers.actions';

export interface VoucherState {
  report: any;
  toView: boolean;
  toSend: boolean;
  success: boolean;
  changed: boolean;
  canceled: boolean;
  confirmed: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
  notConfirmed: boolean;
}

export const initialVoucherState: VoucherState = {
  report: null,
  toView: false,
  toSend: false,
  success: false,
  changed: false,
  canceled: false,
  confirmed: false,
  isLoading: false,
  isEditing: false,
  notConfirmed: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _voucherReducer = createReducer(
  initialVoucherState,

  on(actions.setParamsVouchers, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingVoucher, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search Voucher */
  on(actions.searchVoucher, (state) => ({ ...state, isLoading: true })),

  on(actions.searchVoucherSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchVoucherError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Voucher */
  on(actions.createVoucher, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createVoucherSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createVoucherError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Voucher */
  on(actions.updateVoucher, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateVoucherSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateVoucherError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Voucher */
  on(actions.deleteVoucher, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteVoucherSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteVoucherError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Confirm Voucher */
  on(actions.confirmVoucher, (state, { payload }) => ({
    payload,
    ...state,
    confirmed: false,
    isLoading: true,
  })),

  on(actions.confirmVoucherSuccess, (state) => ({
    ...state,
    confirmed: true,
    isLoading: false,
  })),

  on(actions.confirmVoucherError, (state) => ({
    ...state,
    confirmed: false,
    isLoading: false,
  })),

  /* Not Confirm Voucher */
  on(actions.notConfirmVoucher, (state, { payload }) => ({
    payload,
    ...state,
    notConfirmed: false,
    isLoading: true,
  })),

  on(actions.notConfirmVoucherSuccess, (state) => ({
    ...state,
    notConfirmed: true,
    isLoading: false,
  })),

  on(actions.notConfirmVoucherError, (state) => ({
    ...state,
    notConfirmed: false,
    isLoading: false,
  })),

  /* Change Voucher */
  on(actions.changeVoucher, (state, { payload }) => ({
    payload,
    ...state,
    changed: false,
    isLoading: true,
  })),

  on(actions.changeVoucherSuccess, (state) => ({
    ...state,
    changed: true,
    isLoading: false,
  })),

  on(actions.changeVoucherError, (state) => ({
    ...state,
    changed: false,
    isLoading: false,
  })),

  /* Cancel Voucher */
  on(actions.cancelVoucher, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    canceled: false,
    isLoading: true,
  })),

  on(actions.cancelVoucherSuccess, (state) => ({
    ...state,
    canceled: true,
    isLoading: false,
  })),

  on(actions.cancelVoucherError, (state) => ({
    ...state,
    canceled: false,
    isLoading: false,
  })),

  /* To View Voucher */
  on(actions.toViewVoucher, (state, { payload }) => ({
    payload,
    ...state,
    toView: false,
  })),

  on(actions.toViewVoucherSuccess, (state, { report }) => ({
    ...state,
    report,
    toView: true,
  })),

  on(actions.toViewVoucherError, (state) => ({
    ...state,
    toView: false,
  })),

  /* To Send Voucher */
  on(actions.toSendVoucher, (state, { payload }) => ({
    payload,
    ...state,
    toSend: false,
  })),

  on(actions.toSendVoucherSuccess, (state) => ({
    ...state,
    toSend: true,
  })),

  on(actions.toSendVoucherError, (state) => ({
    ...state,
    toSend: false,
  })),
);

export function voucherReducer(state: VoucherState = initialVoucherState, actions: Action) {
  return _voucherReducer(state, actions);
}
