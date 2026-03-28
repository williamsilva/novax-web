import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { ProviderService } from 'src/app/service';
import * as agentsActions from '../actions/agents.actions';
import * as providersActions from '../actions/providers.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class ProvidersEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected providerService: ProviderService) {
    super(injector);
  }

  searchProviders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(providersActions.searchProvider),
      withLatestFrom(this.store$.select((state) => state.providerState)),
      mergeMap(() =>
        this.providerService.searchProvider().pipe(
          map((provider) => providersActions.searchProviderSuccess({ provider })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(providersActions.searchProviderError());
          }),
        ),
      ),
    ),
  );

  activationProviders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(providersActions.activationProvider),
      mergeMap(({ payload }) =>
        this.providerService.activation(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return providersActions.activationProviderSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(providersActions.activationProviderError());
          }),
        ),
      ),
    ),
  );

  deactivateProviders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(providersActions.deactivateProvider),
      mergeMap(({ payload }) =>
        this.providerService.deactivate(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return providersActions.deactivateProviderSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(providersActions.deactivateProviderError());
          }),
        ),
      ),
    ),
  );
}
