import { TitleCasePipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { EventFilters, Location, Options, User } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as actionsLocation from 'src/app/store/actions/location.actions';
import * as usersStore from 'src/app/store/actions/users.actions';
import { LocationCreateComponent } from '../location-create';

@Component({
  providers: [DialogService],
  selector: 'app-location-consult',
  templateUrl: './location-consult.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [TableModule, SharedModule, ButtonModule, TooltipModule, MultiSelectModule, TitleCasePipe, DatePipe],
})
export class LocationConsultComponent extends BaseResourceListComponent<Location.Model> implements OnInit {
  users: Options.Options[] = [];
  refLocation!: DynamicDialogRef;

  constructor(protected override injector: Injector, protected dialogServiceLocation: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllUsers();
  }

  public override openNew() {
    this.store.dispatch(actionsLocation.isEditingLocation({ isEditing: false }));
    this.openDialogLocation();
  }

  public override editResource(payload: Location.Model) {
    this.store.dispatch(actionsLocation.isEditingLocation({ isEditing: true }));
    this.openDialogLocation(payload);
  }

  public activateHandler(uuid: string) {
    this.store.dispatch(actionsLocation.activationLocation({ uuid }));
  }

  public inactivateHandler(uuid: string) {
    this.store.dispatch(actionsLocation.deactivateLocation({ uuid }));
  }

  protected override delete(payload: number) {
    this.store.dispatch(actionsLocation.deleteLocation({ payload }));
  }

  protected openDialogLocation(location?: Location.Model) {
    this.refLocation = this.dialogServiceLocation.open(LocationCreateComponent, {
      width: '55%',
      data: location,
      baseZIndex: 1000,
      header: 'Destinos',
      closeOnEscape: false,
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(actionsLocation.setParamsLocations({ params }));
    this.store.dispatch(actionsLocation.searchLocation());

    this.store
      .select('locationState')
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

  protected searchAllUsers() {
    this.store.dispatch(usersStore.searchAllUsers());

    this.store
      .select('userState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ allUsers }) => {
        if (!this.objectIsEmpty(allUsers)) {
          let user = allUsers;
          (user = user.filter((u: User.Minimal) => u.name !== this.wsPermissions.ROLE_MASTER)),
            (this.users = user.sort((a: User.Minimal, b: User.Minimal) => {
              return a.name < b.name ? -1 : 1;
            }));
        }
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
    this.fileName = 'Locais';
    this.headPdf = [['Descrição', 'Status']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([this.resources[i].description, this.setDescription.status(this.resources[i].status)]);
    }
  }

  protected dataToXLSX(i: number) {
    return this.mountObject(this.resources[i].description, this.setDescription.status(this.resources[i].status));
  }

  protected mountObject(description: string, status: string) {
    return {
      Descrição: description,
      Status: status,
    };
  }
}
