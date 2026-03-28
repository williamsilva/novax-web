import { Action, createReducer, on } from '@ngrx/store';
import { ContentProps, EventFilters } from 'src/app/models';

import * as actions from 'src/app/store/actions/agents.actions';

export interface AgentState {
  success: boolean;
  data: ContentProps;
  isEditing: boolean;
  isLoading: boolean;
  agentType: string[];
  params: EventFilters;
}

export const initialAgentState: AgentState = {
  agentType: [],
  success: false,
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _agentReducer = createReducer(
  initialAgentState,

  on(actions.setParamsAgents, (state, { params }) => ({ ...state, params })),
  on(actions.setAgentType, (state, { agentType }) => ({ ...state, agentType })),
  on(actions.isEditingAgent, (state, { isEditing }) => ({ ...state, isEditing })),

  /* Search Agent */
  on(actions.searchAgent, (state) => ({ ...state, isLoading: true })),

  on(actions.searchAgentSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchAgentError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Agent */
  on(actions.createAgent, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createAgentSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createAgentError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Agent */
  on(actions.updateAgent, (state, { id, payload }) => ({
    id,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateAgentSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateAgentError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Agent */
  on(actions.deleteAgent, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteAgentSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteAgentError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function agentReducer(state: AgentState = initialAgentState, actions: Action) {
  return _agentReducer(state, actions);
}
