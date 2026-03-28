import { Component, Injector, OnInit } from '@angular/core';

import { SharedModule } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  PickListModule,
  PickListMoveAllToTargetEvent,
  PickListMoveToSourceEvent,
  PickListMoveToTargetEvent,
} from 'primeng/picklist';
import { takeUntil } from 'rxjs';
import { User } from 'src/app/models';

import { BaseResourceListComponent } from 'src/app/shared/components';
import * as groupUserActions from 'src/app/store/actions/group-user.actions';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
  standalone: true,
  imports: [PickListModule, SharedModule],
})
export class UsersComponent extends BaseResourceListComponent<User.Model> implements OnInit {
  usersInGroup: User.Minimal[] = [];
  usersAvailable: User.Minimal[] = [];

  constructor(protected override injector: Injector, protected config: DynamicDialogConfig) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAvailableUsers();
    this.searchUserInGroup();
  }

  public onMoveToAvailableUsers(event: PickListMoveToSourceEvent) {
    this.associationMultipleUsers(event);
  }

  public onMoveToUserInGroup(event: PickListMoveToTargetEvent) {
    this.disassociateMultipleUsers(event);
  }

  public onMoveAllToAvailableUsers(event: PickListMoveAllToTargetEvent) {
    this.associationMultipleUsers(event);
  }

  public onMoveAllToUserInGroup(event: PickListMoveToTargetEvent) {
    this.disassociateMultipleUsers(event);
  }

  protected associationMultipleUsers(event: PickListMoveToSourceEvent) {
    const usersId: number[] = [];
    const groupUser = this.config.data;
    event.items.forEach((p: { id: number }) => {
      usersId.push(p.id);
    });

    this.store.dispatch(groupUserActions.associateMultipleUser({ groupId: groupUser.id, usersId }));
  }

  protected disassociateMultipleUsers(event: PickListMoveToTargetEvent) {
    const usersId: number[] = [];
    const groupUser = this.config.data;
    event.items.forEach((p: { id: number }) => {
      usersId.push(p.id);
    });

    this.store.dispatch(groupUserActions.disassociateMultipleUser({ groupId: groupUser.id, usersId }));
  }

  protected searchUserInGroup() {
    const groupUser = this.config.data;
    this.store.dispatch(groupUserActions.searchUserInGroup({ payload: groupUser.id }));

    this.store
      .select('groupUserState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ usersInGroup, isLoading }) => {
        if (!this.objectIsEmpty(usersInGroup)) {
          this.usersInGroup = usersInGroup.sort((a: User.Minimal, b: User.Minimal) => {
            return a.name < b.name ? -1 : 1;
          });
        } else {
          this.usersInGroup = [];
        }
        this.loading = isLoading;
      });
  }

  protected searchAvailableUsers() {
    const groupUser = this.config.data;
    this.store.dispatch(groupUserActions.searchAvailableUsers({ payload: groupUser.id }));

    this.store
      .select('groupUserState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ usersAvailable, isLoading }) => {
        if (!this.objectIsEmpty(usersAvailable)) {
          this.usersAvailable = usersAvailable.sort((a: User.Minimal, b: User.Minimal) => {
            return a.name < b.name ? -1 : 1;
          });
        } else {
          this.usersAvailable = [];
        }
        this.loading = isLoading;
      });
  }
}
