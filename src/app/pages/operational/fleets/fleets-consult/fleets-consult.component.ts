import { DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { Fleets, EventFilters, Options, User, Employee } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as employeeActions from 'src/app/store/actions/employees.actions';
import * as actionsFleets from 'src/app/store/actions/fleets.actions';
import { FleetsCreateComponent } from '../fleets-create';

@Component({
  providers: [DialogService],
  selector: 'app-fleets-consult',
  templateUrl: './fleets-consult.component.html',
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
    MultiSelectModule,
    TooltipModule,
    DatePipe,
    TitleCasePipe,
    DecimalPipe,
  ],
})
export class FleetsConsultComponent extends BaseResourceListComponent<Fleets.Model> implements OnInit {
  employees: Options.Options[] = [];
  refFleets!: DynamicDialogRef;

  constructor(protected override injector: Injector, protected dialogServiceFleets: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllEmployees();
  }

  public override openNew() {
    this.store.dispatch(actionsFleets.isEditingFleets({ isEditing: false }));
    this.openDialogFleets();
  }

  public override editResource(payload: Fleets.Model) {
    this.store.dispatch(actionsFleets.isEditingFleets({ isEditing: true }));
    this.openDialogFleets(payload);
  }

  protected searchAllEmployees() {
    this.store.dispatch(employeeActions.searchAllEmployee());

    this.store
      .select('employeeState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ allEmployees }) => {
        if (!this.objectIsEmpty(allEmployees)) {
          this.employees = allEmployees.sort((a: Employee.Model, b: Employee.Model) => {
            return a.name < b.name ? -1 : 1;
          });
        }
      });
  }

  protected override delete(payload: number) {
    this.store.dispatch(actionsFleets.deleteFleets({ payload }));
  }

  protected openDialogFleets(fleets?: Fleets.Model) {
    this.refFleets = this.dialogServiceFleets.open(FleetsCreateComponent, {
      width: '55%',
      data: fleets,
      baseZIndex: 1000,
      closeOnEscape: false,
      header: 'Registro de Rota',
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(actionsFleets.setParamsFleets({ params }));
    this.store.dispatch(actionsFleets.searchFleets());

    this.store
      .select('fleetsState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, isLoading }) => {
        if (data.content) {
          this.resources = data.content;
          this.setPagesDate(data.page);
        }
        this.loading = isLoading;
      });
  }
}
