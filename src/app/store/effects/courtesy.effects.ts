import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { BaseEffects } from './base.effects';
import { CourtesyService } from 'src/app/service';
import { StatusCourtesyEnum } from 'src/app/models';
import * as courtesyActions from 'src/app/store/actions/courtesy.actions';

@Injectable()
export class CourtesyEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected courtesyService: CourtesyService) {
    super(injector);
  }

  searchCourtesy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courtesyActions.searchCourtesy),
      withLatestFrom(this.store$.select((state) => state.courtesyState)),
      mergeMap(([, { params }]) =>
        this.courtesyService
          .searchByStatus(params, [
            this.getKeyByValueEnum(StatusCourtesyEnum, StatusCourtesyEnum.Pending),
            this.getKeyByValueEnum(StatusCourtesyEnum, StatusCourtesyEnum.Pending),
          ])
          .pipe(
            map((data) => courtesyActions.searchCourtesySuccess({ data })),
            catchError((error) => {
              this.errorHandler.handle(error);
              return of(courtesyActions.searchCourtesyError());
            }),
          ),
      ),
    ),
  );

  createCourtesy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courtesyActions.createCourtesy),
      exhaustMap(({ payload }) =>
        this.courtesyService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(courtesyActions.searchCourtesy());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return courtesyActions.createCourtesySuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(courtesyActions.createCourtesyError());
          }),
        ),
      ),
    ),
  );

  updateCourtesy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courtesyActions.updateCourtesy),
      mergeMap(({ uuid, payload }) =>
        this.courtesyService.updateByUuid(uuid, payload).pipe(
          map(() => {
            this.store$.dispatch(courtesyActions.searchCourtesy());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return courtesyActions.updateCourtesySuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(courtesyActions.updateCourtesyError());
          }),
        ),
      ),
    ),
  );

  deleteCourtesy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courtesyActions.deleteCourtesy),
      mergeMap(({ payload }) =>
        this.courtesyService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(courtesyActions.searchCourtesy());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return courtesyActions.deleteCourtesySuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(courtesyActions.deleteCourtesyError());
          }),
        ),
      ),
    ),
  );

  activationCourtesy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courtesyActions.activationCourtesy),
      mergeMap(({ payload }) =>
        this.courtesyService.activationCourtesy(payload).pipe(
          map(() => {
            this.store$.dispatch(courtesyActions.searchCourtesy());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return courtesyActions.activationCourtesySuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(courtesyActions.activationCourtesyError());
          }),
        ),
      ),
    ),
  );

  deactivateCourtesy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courtesyActions.deactivateCourtesy),
      mergeMap(({ payload }) =>
        this.courtesyService.deactivateCourtesy(payload).pipe(
          map(() => {
            this.store$.dispatch(courtesyActions.searchCourtesy());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return courtesyActions.deactivateCourtesySuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(courtesyActions.deactivateCourtesyError());
          }),
        ),
      ),
    ),
  );

  replacementMultipleCourtesy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courtesyActions.replacementMultipleCourtesy),
      mergeMap(({ payload }) =>
        this.courtesyService.replacementMultiple(payload).pipe(
          map(() => {
            this.store$.dispatch(courtesyActions.searchCourtesy());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return courtesyActions.replacementMultipleCourtesySuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(courtesyActions.replacementMultipleCourtesyError());
          }),
        ),
      ),
    ),
  );
}
