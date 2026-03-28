import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { GroupPermissionService } from 'src/app/service';
import * as groupPermissionActions from '../actions/group-permission.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class GroupsPermissionEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected groupPermissionService: GroupPermissionService) {
    super(injector);
  }

  searchPermissionInGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupPermissionActions.searchPermissionInGroup),
      withLatestFrom(this.store$.select((state) => state.groupState)),
      mergeMap(([{ payload }]) =>
        this.groupPermissionService.searchPermissionInGroup(payload).pipe(
          map((permissionsInGroup) => groupPermissionActions.searchPermissionInGroupSuccess({ permissionsInGroup })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupPermissionActions.searchPermissionInGroupError());
          })
        )
      )
    )
  );

  searchAvailablePermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupPermissionActions.searchAvailablePermissions),
      withLatestFrom(this.store$.select((state) => state.groupState)),
      mergeMap(([{ payload }]) =>
        this.groupPermissionService.searchAvailablePermissions(payload).pipe(
          map((permissionsAvailable) =>
            groupPermissionActions.searchAvailablePermissionsSuccess({ permissionsAvailable })
          ),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupPermissionActions.searchAvailablePermissionsError());
          })
        )
      )
    )
  );

  associateMultiplePermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupPermissionActions.associateMultiplePermission),
      mergeMap(({ groupId, permissionsId }) =>
        this.groupPermissionService.associationMultiple(groupId, permissionsId).pipe(
          map(() => {
            return groupPermissionActions.associateMultiplePermissionSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupPermissionActions.associateMultiplePermissionError());
          })
        )
      )
    )
  );

  disassociateMultiplePermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupPermissionActions.disassociateMultiplePermission),
      mergeMap(({ groupId, permissionsId }) =>
        this.groupPermissionService.disassociateMultiple(groupId, permissionsId).pipe(
          map(() => {
            return groupPermissionActions.disassociateMultiplePermissionSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(groupPermissionActions.disassociateMultiplePermissionError());
          })
        )
      )
    )
  );
}
