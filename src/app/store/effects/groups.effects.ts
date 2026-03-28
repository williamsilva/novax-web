import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { GroupService } from 'src/app/service';
import * as groupsActions from '../actions/groups.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class GroupsEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected groupService: GroupService) {
    super(injector);
  }

  searchGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupsActions.searchGroup),
      withLatestFrom(this.store$.select((state) => state.groupState)),
      mergeMap(([, { params }]) =>
        this.groupService.search(params).pipe(
          map((data) => groupsActions.searchGroupSuccess({ data })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupsActions.searchGroupError());
          }),
        ),
      ),
    ),
  );

  createGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupsActions.createGroup),
      exhaustMap(({ payload }) =>
        this.groupService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(groupsActions.searchGroup());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return groupsActions.createGroupSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupsActions.createGroupError());
          }),
        ),
      ),
    ),
  );

  updateGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupsActions.updateGroup),
      mergeMap(({ id, payload }) =>
        this.groupService.updateById(id, payload).pipe(
          map(() => {
            this.store$.dispatch(groupsActions.searchGroup());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return groupsActions.updateGroupSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupsActions.updateGroupError());
          }),
        ),
      ),
    ),
  );

  deleteGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupsActions.deleteGroup),
      mergeMap(({ payload }) =>
        this.groupService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(groupsActions.searchGroup());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return groupsActions.deleteGroupSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupsActions.deleteGroupError());
          }),
        ),
      ),
    ),
  );
}
