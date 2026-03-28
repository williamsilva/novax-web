import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { StatisticsEquipmentsService } from 'src/app/service/statistics-equipments.service';
import * as statisticsActions from '../actions/statistics-equipment.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class StatisticsEquipmentsEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected statisticsService: StatisticsEquipmentsService) {
    super(injector);
  }

  totalMaintenances$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statisticsActions.totalMaintenances),
      withLatestFrom(this.store$.select((state) => state.statisticsEquipmentsState)),
      mergeMap(([, { filter }]) =>
        this.statisticsService.totalMaintenances(filter).pipe(
          map((maintenancesTotalDTO) => statisticsActions.totalMaintenancesSuccess({ maintenancesTotalDTO })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statisticsActions.totalMaintenancesError());
          }),
        ),
      ),
    ),
  );

  totalEquipments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statisticsActions.totalEquipments),
      withLatestFrom(this.store$.select((state) => state.statisticsEquipmentsState)),
      mergeMap(([, { filter }]) =>
        this.statisticsService.totalEquipments(filter).pipe(
          map((equipmentsTotalDTO) => statisticsActions.totalEquipmentsSuccess({ equipmentsTotalDTO })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statisticsActions.totalEquipmentsError());
          }),
        ),
      ),
    ),
  );

  topEquipments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statisticsActions.topEquipments),
      withLatestFrom(this.store$.select((state) => state.statisticsEquipmentsState)),
      mergeMap(([, { filter }]) =>
        this.statisticsService.topEquipments(filter).pipe(
          map((topEquipments) => statisticsActions.topEquipmentsSuccess({ topEquipments })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statisticsActions.topEquipmentsError());
          }),
        ),
      ),
    ),
  );

  byStatusEquipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(statisticsActions.byStatusEquipments),
      withLatestFrom(this.store$.select((state) => state.statisticsEquipmentsState)),
      mergeMap(([, { filter }]) =>
        this.statisticsService.byStatusEquipments(filter).pipe(
          map((byStatus) => statisticsActions.byStatusEquipmentsSuccess({ byStatus })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(statisticsActions.byStatusEquipmentsError());
          }),
        ),
      ),
    ),
  );
}
