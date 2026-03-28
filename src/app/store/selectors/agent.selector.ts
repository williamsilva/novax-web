import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AgentState } from '../reduces';

const searchAgentFeatureState = createFeatureSelector<AgentState>('agentState');

export const page = createSelector(searchAgentFeatureState, (state: AgentState) => state.data.page);
export const isLoading = createSelector(searchAgentFeatureState, (state: AgentState) => state.isLoading);
export const searchAgent = createSelector(searchAgentFeatureState, (state: AgentState) => state.data.content);
