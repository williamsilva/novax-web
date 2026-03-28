import { Action, createReducer, on } from '@ngrx/store';

import { ContentProps } from 'src/app/models';
import * as actions from 'src/app/store/actions/config-vouchers.actions';

export interface ConfigVoucherState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  config: ContentProps;
}

export const initialConfigVoucherState: ConfigVoucherState = {
  success: false,
  isLoading: false,
  isEditing: false,
  config: { content: [], page: 0 },
};

export const _configVoucherReducer = createReducer(
  initialConfigVoucherState,

  /* Search By Key*/
  on(actions.searchByKey, (state) => ({ ...state })),

  on(actions.searchByKeySuccess, (state, { config }) => ({
    ...state,
    config,
  })),

  on(actions.searchByKeyError, (state) => ({
    ...state,
  })),

  /* Update Config Vouchers */
  on(actions.updateConfigVouchers, (state, { key, payload }) => ({
    key,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateConfigVouchersSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateConfigVouchersError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),
);

export function configVoucherReducer(state: ConfigVoucherState = initialConfigVoucherState, actions: Action) {
  return _configVoucherReducer(state, actions);
}
