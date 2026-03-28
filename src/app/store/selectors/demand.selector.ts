import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DemandState } from '../reduces';

const searchDemandFeatureState = createFeatureSelector<DemandState>('demandState');

export const searchDemand = createSelector(searchDemandFeatureState, (state: DemandState) => state.data);
export const successDemand = createSelector(searchDemandFeatureState, (state: DemandState) => state.success);
export const isLoadingDemand = createSelector(searchDemandFeatureState, (state: DemandState) => state.isLoading);
