import { Action, createReducer, on } from '@ngrx/store';
import { Provider } from 'src/app/models';

import * as actions from 'src/app/store/actions/providers.actions';

export interface ProviderState {
  provider: Provider.Model[];
}

export const initialProviderState: ProviderState = {
  provider: [],
};

export const _providerReducer = createReducer(
  initialProviderState,

  /* Search Provider*/
  on(actions.searchProvider, (state) => ({ ...state })),

  on(actions.searchProviderSuccess, (state, { provider }) => ({
    ...state,
    provider,
  })),

  on(actions.searchProviderError, (state) => ({
    ...state,
  })),

  /* Activation Provider */
  on(actions.activationProvider, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationProviderSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationProviderError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate Provider */
  on(actions.deactivateProvider, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivateProviderSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivateProviderError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),
);

export function providerReducer(state: ProviderState = initialProviderState, actions: Action) {
  return _providerReducer(state, actions);
}
