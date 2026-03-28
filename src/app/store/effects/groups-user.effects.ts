import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { GroupUserService } from 'src/app/service';
import * as groupUserActions from '../actions/group-user.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class GroupsUserEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected groupUserService: GroupUserService) {
    super(injector);
  }

  searchUserInGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupUserActions.searchUserInGroup),
      withLatestFrom(this.store$.select((state) => state.groupState)),
      mergeMap(([{ payload }]) =>
        this.groupUserService.searchUserInGroup(payload).pipe(
          map((usersInGroup) => groupUserActions.searchUserInGroupSuccess({ usersInGroup })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupUserActions.searchUserInGroupError());
          })
        )
      )
    )
  );

  searchAvailableUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupUserActions.searchAvailableUsers),
      withLatestFrom(this.store$.select((state) => state.groupState)),
      mergeMap(([{ payload }]) =>
        this.groupUserService.searchAvailableUsers(payload).pipe(
          map((usersAvailable) => groupUserActions.searchAvailableUsersSuccess({ usersAvailable })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupUserActions.searchAvailableUsersError());
          })
        )
      )
    )
  );

  associateMultipleUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupUserActions.associateMultipleUser),
      mergeMap(({ groupId, usersId }) =>
        this.groupUserService.associationMultiple(groupId, usersId).pipe(
          map(() => {
            return groupUserActions.associateMultipleUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupUserActions.associateMultipleUserError());
          })
        )
      )
    )
  );

  disassociateMultipleUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupUserActions.disassociateMultipleUser),
      mergeMap(({ groupId, usersId }) =>
        this.groupUserService.disassociateMultiple(groupId, usersId).pipe(
          map(() => {
            return groupUserActions.disassociateMultipleUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupUserActions.disassociateMultipleUserError());
          })
        )
      )
    )
  );
}
