import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { AgentService, ClientService } from 'src/app/service';
import * as agentsActions from '../actions/agents.actions';
import * as clientsActions from '../actions/clients.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class ClientsEffects extends BaseEffects {
  constructor(
    protected agentService: AgentService,
    protected override injector: Injector,
    protected clientService: ClientService,
  ) {
    super(injector);
  }

  searchClientsByDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clientsActions.searchClient),
      withLatestFrom(this.store$.select((state) => state.clientState)),
      mergeMap(([, { document }]) =>
        this.agentService.findByDocument(document).pipe(
          map((client) => clientsActions.searchClientSuccess({ client })),
          catchError(() => {
            return of(clientsActions.searchClientError());
          }),
        ),
      ),
    ),
  );

  activationClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clientsActions.activationClient),
      mergeMap(({ payload }) =>
        this.clientService.activation(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return clientsActions.activationClientSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(clientsActions.activationClientError());
          }),
        ),
      ),
    ),
  );

  deactivateClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clientsActions.deactivateClient),
      mergeMap(({ payload }) =>
        this.clientService.deactivate(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return clientsActions.deactivateClientSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(clientsActions.deactivateClientError());
          }),
        ),
      ),
    ),
  );
}
