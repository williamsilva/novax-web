import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, exhaustMap } from 'rxjs';

import { StatusEnum } from 'src/app/models';
import { UserService } from 'src/app/service';
import * as usersActions from '../actions/users.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class UsersEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected userService: UserService) {
    super(injector);
  }

  searchAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.searchAllUsers),
      withLatestFrom(this.store$.select((state) => state.userState)),
      mergeMap(() =>
        this.userService.searchAll().pipe(
          map((allUsers) => usersActions.searchAllUsersSuccess({ allUsers })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.searchAllUsersError());
          }),
        ),
      ),
    ),
  );

  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.searchUser),
      withLatestFrom(this.store$.select((state) => state.userState)),
      mergeMap(([, { params }]) =>
        this.userService.searchByStatus(params, [this.getKeyByValueEnum(StatusEnum, StatusEnum.Active)]).pipe(
          map((data) => usersActions.searchUserSuccess({ data })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.searchUserError());
          }),
        ),
      ),
    ),
  );

  searchNotUniqueUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.notUniqueUser),
      mergeMap(({ payload }) =>
        this.userService.searchExistDocument(payload).pipe(
          map((notUnique) => {
            return usersActions.notUniqueUserSuccess({ notUnique });
          }),
          catchError(() => {
            return of(usersActions.notUniqueUserError());
          }),
        ),
      ),
    ),
  );

  createUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.createUser),
      exhaustMap(({ payload }) =>
        this.userService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(usersActions.searchUser());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return usersActions.createUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.createUserError());
          }),
        ),
      ),
    ),
  );

  changePasswordUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.changePasswordUser),
      exhaustMap(({ payload }) =>
        this.userService.changePassword(payload).pipe(
          map(() => {
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return usersActions.changePasswordUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.changePasswordUserError());
          }),
        ),
      ),
    ),
  );

  updateUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.updateUser),
      mergeMap(({ id, payload }) =>
        this.userService.updateById(id, payload).pipe(
          map(() => {
            this.store$.dispatch(usersActions.searchUser());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return usersActions.updateUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.updateUserError());
          }),
        ),
      ),
    ),
  );

  activationUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.activationUser),
      mergeMap(({ payload }) =>
        this.userService.activation(payload).pipe(
          map(() => {
            this.store$.dispatch(usersActions.searchUser());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return usersActions.activationUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.activationUserError());
          }),
        ),
      ),
    ),
  );

  deactivateUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.deactivateUser),
      mergeMap(({ payload }) =>
        this.userService.deactivate(payload).pipe(
          map(() => {
            this.store$.dispatch(usersActions.searchUser());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return usersActions.deactivateUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.deactivateUserError());
          }),
        ),
      ),
    ),
  );

  activationMultipleUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.activationMultipleUser),
      mergeMap(({ payload }) =>
        this.userService.activateMultiple(payload).pipe(
          map(() => {
            this.store$.dispatch(usersActions.searchUser());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return usersActions.activationMultipleUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.activationMultipleUserError());
          }),
        ),
      ),
    ),
  );

  deactivateMultipleUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.deactivateMultipleUser),
      mergeMap(({ payload }) =>
        this.userService.deactivateMultiple(payload).pipe(
          map(() => {
            this.store$.dispatch(usersActions.searchUser());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return usersActions.deactivateMultipleUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.deactivateMultipleUserError());
          }),
        ),
      ),
    ),
  );

  deleteUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.deleteUser),
      mergeMap(({ payload }) =>
        this.userService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(usersActions.searchUser());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return usersActions.deleteUserSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(usersActions.deleteUserError());
          }),
        ),
      ),
    ),
  );
}
