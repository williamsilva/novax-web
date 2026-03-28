import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { PromoterService } from 'src/app/service';
import * as agentsActions from '../actions/agents.actions';
import * as promotersActions from '../actions/promoters.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class PromotersEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected promoterService: PromoterService) {
    super(injector);
  }

  searchPromoters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(promotersActions.searchPromoter),
      withLatestFrom(this.store$.select((state) => state.promoterState)),
      mergeMap(() =>
        this.promoterService.searchPromoter().pipe(
          map((promoter) => promotersActions.searchPromoterSuccess({ promoter })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(promotersActions.searchPromoterError());
          }),
        ),
      ),
    ),
  );

  activationPromoters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(promotersActions.activationPromoter),
      mergeMap(({ payload }) =>
        this.promoterService.activation(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return promotersActions.activationPromoterSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(promotersActions.activationPromoterError());
          }),
        ),
      ),
    ),
  );

  deactivatePromoters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(promotersActions.deactivatePromoter),
      mergeMap(({ payload }) =>
        this.promoterService.deactivate(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return promotersActions.deactivatePromoterSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(promotersActions.deactivatePromoterError());
          }),
        ),
      ),
    ),
  );
}
