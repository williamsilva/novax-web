import { Action, createReducer, on } from '@ngrx/store';

import { PostalCodeModel, State } from 'src/app/models';
import * as actions from 'src/app/store/actions/states.actions';

export interface StateState {
  success: boolean;
  isLoading: boolean;
  allState: State.Model[];
  address: PostalCodeModel;
}

export const initialStateState: StateState = {
  allState: [],
  success: false,
  isLoading: false,
  address: { bairro: '', cep: '', complemento: '', localidade: '', logradouro: '', uf: '' },
};

export const _stateReducer = createReducer(
  initialStateState,

  /* Search State */
  on(actions.searchState, (state) => ({ ...state, isLoading: true })),

  on(actions.searchStateSuccess, (state, { allState }) => ({
    ...state,
    allState,
    isLoading: false,
  })),

  on(actions.searchStateError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search City */
  on(actions.consultPostalCode, (state) => ({ ...state, isLoading: true })),

  on(actions.consultPostalCodeSuccess, (state, { address }) => ({
    ...state,
    address,
    isLoading: false,
  })),

  on(actions.consultPostalCodeError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function stateReducer(state: StateState = initialStateState, actions: Action) {
  return _stateReducer(state, actions);
}
