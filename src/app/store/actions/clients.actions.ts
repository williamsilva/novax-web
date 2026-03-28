import { createAction, props } from '@ngrx/store';

import { Agent } from 'src/app/models';

export const setDocument = createAction('[Client] Document', props<{ document: string }>());

/* Search Clients*/
export const searchClient = createAction('[Client] Search');
export const searchClientError = createAction('[Client] Search Error');
export const searchClientSuccess = createAction('[Client] Search Success', props<{ client: Agent.MinimalModel }>());

/* Activation Clients */
export const activationClientError = createAction('[Clients] Activation Error');
export const activationClientSuccess = createAction('[Clients] Activation Success');
export const activationClient = createAction('[Clients] Activation', props<{ payload: number }>());

/* Deactivate Clients */
export const deactivateClientError = createAction('[Clients] Deactivate Error');
export const deactivateClientSuccess = createAction('[Clients] Deactivate Success');
export const deactivateClient = createAction('[Clients] Deactivate', props<{ payload: number }>());
