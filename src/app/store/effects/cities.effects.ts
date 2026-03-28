import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { CityService } from 'src/app/service';
import * as citiesActions from '../actions/cities.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class CitiesEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected cityService: CityService) {
    super(injector);
  }

  searchCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(citiesActions.searchCityByUf),
      withLatestFrom(this.store$.select((state) => state.cityState)),
      mergeMap(([{ payload }]) =>
        this.cityService.searchCityByUf(payload).pipe(
          map((cities) => citiesActions.searchCityByUfSuccess({ cities })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(citiesActions.searchCityByUfError());
          }),
        ),
      ),
    ),
  );

  searchNameAndState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(citiesActions.searchNameAndState),
      withLatestFrom(this.store$.select((state) => state.cityState)),
      mergeMap(([{ state, city }]) =>
        this.cityService.searchNameAndState(state, city).pipe(
          map((city) => citiesActions.searchNameAndStateSuccess({ city })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(citiesActions.searchNameAndStateError());
          }),
        ),
      ),
    ),
  );
}
