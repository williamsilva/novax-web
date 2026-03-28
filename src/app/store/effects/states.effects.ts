import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { StateService } from 'src/app/service';
import * as statesActions from '../actions/states.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class StatesEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected stateService: StateService) {
    super(injector);
  }

  searchStates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statesActions.searchState),
      withLatestFrom(this.store$.select((state) => state.stateState)),
      mergeMap(() =>
        this.stateService.searchAllState().pipe(
          map((allState) => statesActions.searchStateSuccess({ allState })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statesActions.searchStateError());
          }),
        ),
      ),
    ),
  );

  consultPostalCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statesActions.consultPostalCode),
      withLatestFrom(this.store$.select((state) => state.stateState)),
      mergeMap(([{ cep }]) =>
        this.stateService.consultPostalCode(cep).pipe(
          map((address) => statesActions.consultPostalCodeSuccess({ address })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statesActions.consultPostalCodeError());
          }),
        ),
      ),
    ),
  );
}
