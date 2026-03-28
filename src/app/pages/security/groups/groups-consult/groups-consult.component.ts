import { UpperCasePipe, TitleCasePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { EventFilters, Group } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as groupsActions from 'src/app/store/actions/groups.actions';

import { GroupsCreateComponent } from '../groups-create/groups-create.component';
import { PermissionComponent } from '../permission';
import { UsersComponent } from '../users';

@Component({
  providers: [DialogService],
  selector: 'app-groups-consult',
  templateUrl: './groups-consult.component.html',
  styles: [],
  standalone: true,
  imports: [TableModule, SharedModule, ButtonModule, TooltipModule, UpperCasePipe, TitleCasePipe],
})
export class GroupsConsultComponent extends BaseResourceListComponent<Group.Model> implements OnInit {
  refGroup!: DynamicDialogRef;

  constructor(protected override injector: Injector, protected dialogServiceGroup: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public override openNew() {
    this.store.dispatch(groupsActions.isEditingGroup({ isEditing: false }));
    this.openDialogGroup();
  }

  public override editResource(payload: Group.Model) {
    this.store.dispatch(groupsActions.isEditingGroup({ isEditing: true }));
    this.openDialogGroup(payload);
  }

  public override delete(payload: number) {
    this.store.dispatch(groupsActions.deleteGroup({ payload }));
  }

  public openPropertiesUsers() {
    if (this.objectIsEmpty(this.selectionSingleTable)) {
      this.messageService.add({
        severity: 'error',
        detail: 'Selecione um Grupo!',
      });
    } else {
      this.refGroup = this.dialogServiceGroup.open(UsersComponent, {
        width: '70%',
        baseZIndex: 1000,
        closeOnEscape: false,
        data: this.selectionSingleTable,
        header: `Usuários do grupo ${this.selectionSingleTable?.name}`,
      });
    }
  }

  public openPropertiesPermissions() {
    if (this.objectIsEmpty(this.selectionSingleTable)) {
      this.messageService.add({
        severity: 'error',
        detail: 'Selecione um Grupo!',
      });
    } else {
      this.refGroup = this.dialogServiceGroup.open(PermissionComponent, {
        width: '70%',
        baseZIndex: 1000,
        closeOnEscape: false,
        data: this.selectionSingleTable,
        header: `Permissões do grupo ${this.selectionSingleTable?.name}`,
      });
    }
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(groupsActions.setParamsGroups({ params }));
    this.store.dispatch(groupsActions.searchGroup());

    this.store
      .select('groupState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, isLoading }) => {
        if (data.content) {
          this.resources = data.content;
          this.setPagesDate(data.page);
        }
        this.loading = isLoading;
      });
  }

  protected openDialogGroup(group?: Group.Model) {
    this.refGroup = this.dialogServiceGroup.open(GroupsCreateComponent, {
      width: '55%',
      data: group,
      header: 'Grupo',
      baseZIndex: 1000,
      closeOnEscape: false,
    });
  }
}
