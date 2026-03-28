import { Component, Injector, OnInit } from '@angular/core';

import { SharedModule } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  PickListModule,
  PickListMoveAllToSourceEvent,
  PickListMoveAllToTargetEvent,
  PickListMoveToSourceEvent,
  PickListMoveToTargetEvent,
} from 'primeng/picklist';
import { takeUntil } from 'rxjs';
import { Group, User } from 'src/app/models';

import { BaseResourceListComponent } from 'src/app/shared/components';
import * as permissionGroupActions from 'src/app/store/actions/group-permission.actions';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styles: [],
  standalone: true,
  imports: [PickListModule, SharedModule],
})
export class PermissionComponent extends BaseResourceListComponent<Group.Permission> implements OnInit {
  permissionsInGroup: User.Permission[] = [];
  permissionsAvailable: User.Permission[] = [];

  constructor(protected override injector: Injector, protected config: DynamicDialogConfig) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAvailablePermissions();
    this.searchPermissionInGroup();
  }

  public onMoveToAvailablePermissions(event: PickListMoveToSourceEvent) {
    this.associationMultiplePermissions(event);
  }

  public onMoveToPermissionInGroup(event: PickListMoveToTargetEvent) {
    this.disassociateMultiplePermissions(event);
  }

  public onMoveAllToAvailablePermissions(event: PickListMoveAllToTargetEvent) {
    this.associationMultiplePermissions(event);
  }

  public onMoveAllToPermissionInGroup(event: PickListMoveAllToSourceEvent) {
    this.disassociateMultiplePermissions(event);
  }

  protected associationMultiplePermissions(event: PickListMoveAllToTargetEvent) {
    const permissionsId: number[] = [];
    const groupPermission = this.config.data;
    event.items.forEach((p: { id: number }) => {
      permissionsId.push(p.id);
    });

    this.store.dispatch(
      permissionGroupActions.associateMultiplePermission({ groupId: groupPermission.id, permissionsId }),
    );
  }

  protected disassociateMultiplePermissions(event: PickListMoveAllToSourceEvent) {
    const permissionsId: number[] = [];
    const groupPermission = this.config.data;
    event.items.forEach((p: { id: number }) => {
      permissionsId.push(p.id);
    });

    this.store.dispatch(
      permissionGroupActions.disassociateMultiplePermission({ groupId: groupPermission.id, permissionsId }),
    );
  }

  protected searchPermissionInGroup() {
    const groupPermission = this.config.data;
    this.store.dispatch(permissionGroupActions.searchPermissionInGroup({ payload: groupPermission.id }));

    this.store
      .select('groupPermissionState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ permissionsInGroup, isLoading }) => {
        if (!this.objectIsEmpty(permissionsInGroup)) {
          this.permissionsInGroup = permissionsInGroup.sort((a: Group.Permission, b: Group.Permission) => {
            return a.name < b.name ? -1 : 1;
          });
        } else {
          this.permissionsInGroup = [];
        }
        this.loading = isLoading;
      });
  }

  protected searchAvailablePermissions() {
    const groupPermission = this.config.data;
    this.store.dispatch(permissionGroupActions.searchAvailablePermissions({ payload: groupPermission.id }));

    this.store
      .select('groupPermissionState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ permissionsAvailable, isLoading }) => {
        if (!this.objectIsEmpty(permissionsAvailable)) {
          this.permissionsAvailable = permissionsAvailable.sort((a: Group.Permission, b: Group.Permission) => {
            return a.name < b.name ? -1 : 1;
          });
        } else {
          this.permissionsAvailable = [];
        }
        this.loading = isLoading;
      });
  }
}
