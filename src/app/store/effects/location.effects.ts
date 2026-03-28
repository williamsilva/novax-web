import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { LocationService } from 'src/app/service';
import * as locationActions from 'src/app/store/actions/location.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class LocationEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected locationService: LocationService) {
    super(injector);
  }

  searchAllLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(locationActions.searchAllLocation),
      withLatestFrom(this.store$.select((state) => state.locationState)),
      mergeMap(() =>
        this.locationService.searchAllLocation().pipe(
          map((location) => locationActions.searchAllLocationSuccess({ location })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(locationActions.searchAllLocationError());
          }),
        ),
      ),
    ),
  );

  searchLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(locationActions.searchLocation),
      withLatestFrom(this.store$.select((state) => state.locationState)),
      mergeMap(([, { params }]) =>
        this.locationService.search(params).pipe(
          map((data) => locationActions.searchLocationSuccess({ data })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(locationActions.searchLocationError());
          }),
        ),
      ),
    ),
  );

  createLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(locationActions.createLocation),
      exhaustMap(({ payload }) =>
        this.locationService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(locationActions.searchLocation());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return locationActions.createLocationSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(locationActions.createLocationError());
          }),
        ),
      ),
    ),
  );

  updateLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(locationActions.updateLocation),
      mergeMap(({ uuid, payload }) =>
        this.locationService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(locationActions.searchLocation());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return locationActions.updateLocationSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(locationActions.updateLocationError());
          }),
        ),
      ),
    ),
  );

  deleteLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(locationActions.deleteLocation),
      mergeMap(({ payload }) =>
        this.locationService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(locationActions.searchLocation());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return locationActions.deleteLocationSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(locationActions.deleteLocationError());
          }),
        ),
      ),
    ),
  );

  activationLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(locationActions.activationLocation),
      mergeMap(({ uuid }) =>
        this.locationService.activationByUuid(uuid).pipe(
          map(() => {
            this.store$.dispatch(locationActions.searchLocation());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return locationActions.activationLocationSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(locationActions.activationLocationError());
          }),
        ),
      ),
    ),
  );

  deactivateLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(locationActions.deactivateLocation),
      mergeMap(({ uuid }) =>
        this.locationService.deactivateByUuid(uuid).pipe(
          map(() => {
            this.store$.dispatch(locationActions.searchLocation());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return locationActions.deactivateLocationSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(locationActions.deactivateLocationError());
          }),
        ),
      ),
    ),
  );
}
