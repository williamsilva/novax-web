import { Action, createReducer, on } from '@ngrx/store';
import { City, ContentProps } from 'src/app/models';

import * as actions from 'src/app/store/actions/cities.actions';

export interface CityState {
  success: boolean;
  isLoading: boolean;
  cities: City.Model[];
  city: ContentProps;
}

export const initialCityState: CityState = {
  cities: [],
  success: false,
  isLoading: false,
  city: { content: [], page: 0 },
};

export const _cityReducer = createReducer(
  initialCityState,

  /* Search City */
  on(actions.searchCityByUf, (state) => ({ ...state, isLoading: true })),

  on(actions.searchCityByUfSuccess, (state, { cities }) => ({
    ...state,
    cities,
    isLoading: false,
  })),

  on(actions.searchCityByUfError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search Name And State */
  on(actions.searchNameAndState, (state) => ({ ...state, isLoading: true })),

  on(actions.searchNameAndStateSuccess, (state, { city }) => ({
    ...state,
    city,
    isLoading: false,
  })),

  on(actions.searchNameAndStateError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function cityReducer(state: CityState = initialCityState, actions: Action) {
  return _cityReducer(state, actions);
}
