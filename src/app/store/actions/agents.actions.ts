import { createAction, props } from '@ngrx/store';

import { ContentProps, Agent, EventFilters } from 'src/app/models';

export const setParamsAgents = createAction('[Agent] Params', props<{ params: EventFilters }>());
export const setAgentType = createAction('[Agent] AgentType', props<{ agentType: string[] }>());
export const isEditingAgent = createAction('[Agent] IsEditing', props<{ isEditing: boolean }>());

/* Search Agent */
export const searchAgent = createAction('[Agent] Search');
export const searchAgentError = createAction('[Agent] Search Error');
export const searchAgentSuccess = createAction('[Agent] Search Success', props<{ data: ContentProps }>());

/* Create Agent */
export const createAgentError = createAction('[Agent] Create Error');
export const createAgentSuccess = createAction('[Agent] Create Success');
export const createAgent = createAction('[Agent] Create', props<{ payload: Agent.Input }>());

/* Update Agent */
export const updateAgentError = createAction('[Agent] Update Error');
export const updateAgentSuccess = createAction('[Agent] Update Success');
export const updateAgent = createAction('[Agent] Update', props<{ id: number; payload: Agent.Input }>());

/* Delete Agent */
export const deleteAgentError = createAction('[Agent] Delete Error');
export const deleteAgentSuccess = createAction('[Agent] Delete Success');
export const deleteAgent = createAction('[Agent] Delete Agent', props<{ payload: number }>());
