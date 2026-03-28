import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { StatusEnum } from 'src/app/models';
import { AgentService } from 'src/app/service';
import * as agentsActions from '../actions/agents.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class AgentsEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected agentService: AgentService) {
    super(injector);
  }

  searchAgents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(agentsActions.searchAgent),
      withLatestFrom(this.store$.select((state) => state.agentState)),
      mergeMap(([, { params, agentType }]) =>
        this.agentService
          .searchByAgentType(params, agentType, [this.getKeyByValueEnum(StatusEnum, StatusEnum.Active)])
          .pipe(
            map((data) => agentsActions.searchAgentSuccess({ data })),
            catchError((error) => {
              this.errorHandler.handle(error);
              return of(agentsActions.searchAgentError());
            }),
          ),
      ),
    ),
  );

  createAgents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(agentsActions.createAgent),
      exhaustMap(({ payload }) =>
        this.agentService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return agentsActions.createAgentSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(agentsActions.createAgentError());
          }),
        ),
      ),
    ),
  );

  updateAgents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(agentsActions.updateAgent),
      mergeMap(({ id, payload }) =>
        this.agentService.updateById(id, payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return agentsActions.updateAgentSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(agentsActions.updateAgentError());
          }),
        ),
      ),
    ),
  );

  deleteAgents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(agentsActions.deleteAgent),
      mergeMap(({ payload }) =>
        this.agentService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return agentsActions.deleteAgentSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(agentsActions.deleteAgentError());
          }),
        ),
      ),
    ),
  );
}
