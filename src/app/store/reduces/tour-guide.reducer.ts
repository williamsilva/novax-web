import { Action, createReducer, on } from '@ngrx/store';
import { TourGuide } from 'src/app/models';

import * as actions from 'src/app/store/actions/tour-guide.actions';

export interface TourGuideState {
  tourGuide: TourGuide.Model[];
  allTourGuides: TourGuide.Model[];
}

export const initialTourGuideState: TourGuideState = {
  tourGuide: [],
  allTourGuides: [],
};

export const _tourGuideReducer = createReducer(
  initialTourGuideState,

  /* Search All TourGuide */
  on(actions.searchAllTourGuide, (state) => ({ ...state, isLoading: true })),

  on(actions.searchAllTourGuideSuccess, (state, { allTourGuides }) => ({
    ...state,
    allTourGuides,
    isLoading: false,
  })),

  on(actions.searchAllTourGuideError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search TourGuide*/
  on(actions.searchTourGuides, (state) => ({ ...state })),

  on(actions.searchTourGuidesSuccess, (state, { tourGuide }) => ({
    ...state,
    tourGuide,
  })),

  on(actions.searchTourGuidesError, (state) => ({
    ...state,
  })),

  /* Activation TourGuide */
  on(actions.activationTourGuide, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationTourGuideSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationTourGuideError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate TourGuide */
  on(actions.deactivateTourGuide, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivateTourGuideSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivateTourGuideError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),
);

export function tourGuideReducer(state: TourGuideState = initialTourGuideState, actions: Action) {
  return _tourGuideReducer(state, actions);
}
