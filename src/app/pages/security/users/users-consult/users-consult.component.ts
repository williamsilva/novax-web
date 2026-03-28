import { TitleCasePipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { EventFilters, Options, User } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as usersActions from 'src/app/store/actions/users.actions';
import { MaskDocumentPipe } from '../../../../shared/mask-document.pipe';
import { UsersCreateComponent } from '../users-create';

@Component({
  providers: [DialogService],
  selector: 'app-users-consult',
  templateUrl: './users-consult.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [
    TableModule,
    SharedModule,
    ButtonModule,
    TooltipModule,
    MultiSelectModule,
    TitleCasePipe,
    DatePipe,
    MaskDocumentPipe,
  ],
})
export class UsersConsultComponent extends BaseResourceListComponent<User.Model> implements OnInit {
  users: Options.Options[] = [];

  disabledActivate = false;
  disabledInactivate = false;
  refUser!: DynamicDialogRef;

  constructor(protected override injector: Injector, protected dialogServiceUser: DialogService) {
    super(injector);
    this.isRowSelectable = this.isRowSelectable.bind(this);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllUsers();
  }

  public override openNew() {
    this.store.dispatch(usersActions.isEditingUser({ isEditing: false }));
    this.openDialogUser();
  }

  public override editResource(payload: User.Model) {
    this.store.dispatch(usersActions.isEditingUser({ isEditing: true }));
    this.openDialogUser(payload);
  }

  public isRowSelectable(event: User.Model) {
    return !this.disabledTableCheckbox(event);
  }

  public disabledTableCheckbox(payload: User.Model) {
    const user_id = Number(this.auth.jwtPayload?.user_id);

    if (user_id === payload.id) {
      return true;
    } else {
      return false;
    }
  }

  public canSelect(user: User.Model) {
    if (!this.selectionMultipleTable || !this.selectionMultipleTable.length) {
      return;
    } else {
      if (this.selectionMultipleTable[0].status === 'ACTIVE') {
        this.disabledInactivate = true;
        this.disabledActivate = false;
      } else {
        this.disabledInactivate = false;
        this.disabledActivate = true;
      }
      return Boolean(this.selectionMultipleTable[0].status !== user.status);
    }
  }

  public activeByPermission() {
    if (this.auth.hasAnyPermission([this.wsPermissions.ROLE_USERS_ACTIVE_OR_INACTIVE])) {
      return false;
    }

    return true;
  }

  public activateHandler(payload: number) {
    this.store.dispatch(usersActions.activationUser({ payload }));
  }

  public inactivateHandler(payload: number) {
    this.store.dispatch(usersActions.deactivateUser({ payload }));
  }

  public activateSelectedResources() {
    const payload: number[] = [];
    this.selectionMultipleTable.forEach((selected) => {
      payload.push(selected.id);
    });
    this.store.dispatch(usersActions.activationMultipleUser({ payload }));
  }

  public inactivateSelectedResources() {
    const payload: number[] = [];
    this.selectionMultipleTable.forEach((selected) => {
      payload.push(selected.id);
    });
    this.store.dispatch(usersActions.deactivateMultipleUser({ payload }));
  }

  public override delete(payload: number) {
    this.store.dispatch(usersActions.deleteUser({ payload }));
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(usersActions.setParamsUsers({ params }));
    this.store.dispatch(usersActions.searchUser());

    this.store
      .select('userState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, isLoading }) => {
        if (data.content) {
          this.resources = data.content;
          this.setPagesDate(data.page);

          this.toDataPdf();
          this.toDataXLSX();
        }
        this.loading = isLoading;
      });
  }

  protected openDialogUser(user?: User.Model) {
    this.refUser = this.dialogServiceUser.open(UsersCreateComponent, {
      width: '55%',
      data: user,
      baseZIndex: 1000,
      header: 'Usuário',
      closeOnEscape: false,
    });
  }

  protected searchAllUsers() {
    this.store.dispatch(usersActions.searchAllUsers());

    this.store
      .select('userState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ allUsers, isLoading }) => {
        if (!this.objectIsEmpty(allUsers)) {
          this.users = allUsers.sort((a: User.Minimal, b: User.Minimal) => {
            return a.name < b.name ? -1 : 1;
          });
        }
        this.loading = isLoading;
      });
  }

  protected toDataXLSX() {
    this.dataXLSX = [];
    for (let i = 0; i < this.resources.length; i++) {
      this.dataXLSX.push(this.dataToXLSX(i));
    }
  }

  protected override toSelectedXLSX() {
    this.dataSelectedXLSX = [];
    for (let i = 0; i < this.selectionMultipleTable.length; i++) {
      this.dataSelectedXLSX.push(this.dataToXLSX(i));
    }
  }

  protected toDataPdf() {
    this.dataPdf = [];
    this.fileName = 'Usuarios';
    this.headPdf = [['Nome', 'Usuario', 'Documento', 'Status']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].name,
        this.resources[i].email,
        this.resources[i].document,
        this.setDescription.status(this.resources[i].status),
      ]);
    }
  }

  protected dataToXLSX(i: number) {
    return this.mountObject(
      this.resources[i].name,
      this.resources[i].email,
      this.resources[i].document,
      this.setDescription.status(this.resources[i].status),
    );
  }

  protected mountObject(nome: string, email: string, document: string, status: string) {
    return {
      Nome: nome,
      Usuario: email,
      Documento: document,
      Status: status,
    };
  }
}
