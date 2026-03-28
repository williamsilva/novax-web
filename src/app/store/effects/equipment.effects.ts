import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { StatusEquipmentEnum } from 'src/app/models';
import { EquipmentService } from 'src/app/service';

import * as equipmentActions from 'src/app/store/actions/equipment.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class EquipmentEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected equipmentService: EquipmentService) {
    super(injector);
  }

  searchEquipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(equipmentActions.searchEquipment),
      withLatestFrom(this.store$.select((state) => state.equipmentState)),
      mergeMap(([, { params }]) =>
        this.equipmentService
          .searchByStatus(params, [
            this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Active),
            this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Maintenance),
          ])
          .pipe(
            map((data) => equipmentActions.searchEquipmentSuccess({ data })),
            catchError((error) => {
              this.errorHandler.handle(error);
              return of(equipmentActions.searchEquipmentError());
            }),
          ),
      ),
    ),
  );

  createEquipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(equipmentActions.createEquipment),
      exhaustMap(({ payload }) =>
        this.equipmentService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(equipmentActions.searchEquipment());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return equipmentActions.createEquipmentSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(equipmentActions.createEquipmentError());
          }),
        ),
      ),
    ),
  );

  updateEquipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(equipmentActions.updateEquipment),
      mergeMap(({ uuid, payload }) =>
        this.equipmentService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(equipmentActions.searchEquipment());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return equipmentActions.updateEquipmentSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(equipmentActions.updateEquipmentError());
          }),
        ),
      ),
    ),
  );

  deleteEquipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(equipmentActions.deleteEquipment),
      mergeMap(({ payload }) =>
        this.equipmentService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(equipmentActions.searchEquipment());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return equipmentActions.deleteEquipmentSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(equipmentActions.deleteEquipmentError());
          }),
        ),
      ),
    ),
  );

  searchPatrimony$ = createEffect(() =>
    this.actions$.pipe(
      ofType(equipmentActions.searchPatrimony),
      withLatestFrom(this.store$.select((state) => state.equipmentState)),
      mergeMap(([, { paramsPatrimony }]) =>
        this.equipmentService.searchPatrimony(paramsPatrimony).pipe(
          map((equipment) => equipmentActions.searchPatrimonySuccess({ equipment })),
          catchError(() => {
            return of(equipmentActions.searchPatrimonyError());
          }),
        ),
      ),
    ),
  );
}
