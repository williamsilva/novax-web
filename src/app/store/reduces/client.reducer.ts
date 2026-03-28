import { Action, createReducer, on } from '@ngrx/store';

import { Agent } from 'src/app/models';

import * as actions from 'src/app/store/actions/clients.actions';

export interface ClientState {
  document: string;
  client: Agent.MinimalModel;
}

export const initialClientState: ClientState = {
  document: '',
  client: { code: 0, id: 0, name: '' },
};

export const _clientReducer = createReducer(
  initialClientState,

  on(actions.setDocument, (state, { document }) => ({ ...state, document })),

  /* Search Client*/
  on(actions.searchClient, (state) => ({ ...state })),

  on(actions.searchClientSuccess, (state, { client }) => ({
    ...state,
    client,
  })),

  on(actions.searchClientError, (state) => ({
    ...state,
  })),
);

export function clientReducer(state: ClientState = initialClientState, actions: Action) {
  return _clientReducer(state, actions);
}
