import { Action, createReducer, on } from '@ngrx/store';
import { Promoter } from 'src/app/models';

import * as actions from 'src/app/store/actions/promoters.actions';

export interface PromoterState {
  promoter: Promoter.Model[];
}

export const initialPromoterState: PromoterState = {
  promoter: [],
};

export const _promoterReducer = createReducer(
  initialPromoterState,

  /* Search Promoter*/
  on(actions.searchPromoter, (state) => ({ ...state })),

  on(actions.searchPromoterSuccess, (state, { promoter }) => ({
    ...state,
    promoter,
  })),

  on(actions.searchPromoterError, (state) => ({
    ...state,
  })),

  /* Activation Promoter */
  on(actions.activationPromoter, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationPromoterSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationPromoterError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate Promoter */
  on(actions.deactivatePromoter, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivatePromoterSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivatePromoterError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),
);

export function promoterReducer(state: PromoterState = initialPromoterState, actions: Action) {
  return _promoterReducer(state, actions);
}
