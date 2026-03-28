import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { TourGuideService } from 'src/app/service';
import * as agentsActions from '../actions/agents.actions';
import * as tourGuideActions from '../actions/tour-guide.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class TourGuidesEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected tourGuideService: TourGuideService) {
    super(injector);
  }

  searchAllTourGuides$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tourGuideActions.searchAllTourGuide),
      withLatestFrom(this.store$.select((state) => state.tourGuideState)),
      mergeMap(() =>
        this.tourGuideService.searchTourGuide().pipe(
          map((allTourGuides) => tourGuideActions.searchAllTourGuideSuccess({ allTourGuides })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(tourGuideActions.searchAllTourGuideError());
          }),
        ),
      ),
    ),
  );

  searchTourGuides$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tourGuideActions.searchTourGuides),
      withLatestFrom(this.store$.select((state) => state.tourGuideState)),
      mergeMap(() =>
        this.tourGuideService.searchTourGuide().pipe(
          map((tourGuide) => tourGuideActions.searchTourGuidesSuccess({ tourGuide })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(tourGuideActions.searchTourGuidesError());
          }),
        ),
      ),
    ),
  );

  activationTourGuides$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tourGuideActions.activationTourGuide),
      mergeMap(({ payload }) =>
        this.tourGuideService.activation(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return tourGuideActions.activationTourGuideSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(tourGuideActions.activationTourGuideError());
          }),
        ),
      ),
    ),
  );

  deactivateTourGuides$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tourGuideActions.deactivateTourGuide),
      mergeMap(({ payload }) =>
        this.tourGuideService.deactivate(payload).pipe(
          map(() => {
            this.store$.dispatch(agentsActions.searchAgent());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return tourGuideActions.deactivateTourGuideSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(tourGuideActions.deactivateTourGuideError());
          }),
        ),
      ),
    ),
  );
}
