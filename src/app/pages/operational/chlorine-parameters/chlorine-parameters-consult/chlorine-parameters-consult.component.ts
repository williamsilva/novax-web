import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SelectItem, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import {
  ShiftEnum,
  BrineTankEnum,
  KeyValueShift,
  WaterTankEnum,
  KeyValueBrineTank,
  KeyValueWaterTank,
  ChlorineParameters,
  EventFilters,
} from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as actionsChlorineParameters from 'src/app/store/actions/chlorine-parameters.actions';
import { ChlorineParametersCreateComponent } from '../chlorine-parameters-create';

@Component({
  providers: [DialogService],
  selector: 'app-chlorine-parameters-consult',
  templateUrl: './chlorine-parameters-consult.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [TableModule, SharedModule, ButtonModule, MultiSelectModule, TooltipModule, DatePipe],
})
export class ChlorineParametersConsultComponent
  extends BaseResourceListComponent<ChlorineParameters.Model>
  implements OnInit
{
  shiftEnum: SelectItem[] = [];
  waterTankEnum: SelectItem[] = [];
  brineTankEnum: SelectItem[] = [];

  refChlorineParameters!: DynamicDialogRef;

  keyValueShift = new KeyValueShift();
  keyValueBrineTank = new KeyValueBrineTank();
  keyValueWaterTank = new KeyValueWaterTank();

  constructor(protected override injector: Injector, protected dialogServiceChlorineParameters: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.shiftEnum = this.setEnumValues(ShiftEnum);
    this.waterTankEnum = this.setEnumValues(WaterTankEnum);
    this.brineTankEnum = this.setEnumValues(BrineTankEnum);
  }

  public override openNew() {
    this.store.dispatch(actionsChlorineParameters.isEditingChlorineParameters({ isEditing: false }));
    this.openDialogChlorineParameters();
  }

  public override editResource(payload: ChlorineParameters.Model) {
    this.store.dispatch(actionsChlorineParameters.isEditingChlorineParameters({ isEditing: true }));
    this.openDialogChlorineParameters(payload);
  }

  protected override delete(payload: number) {
    this.store.dispatch(actionsChlorineParameters.deleteChlorineParameters({ payload }));
  }

  protected openDialogChlorineParameters(chlorineParameters?: ChlorineParameters.Model) {
    this.refChlorineParameters = this.dialogServiceChlorineParameters.open(ChlorineParametersCreateComponent, {
      width: '55%',
      baseZIndex: 1000,
      closeOnEscape: false,
      header: 'Parâmetros',
      data: chlorineParameters,
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(actionsChlorineParameters.setParamsChlorineParameters({ params }));
    this.store.dispatch(actionsChlorineParameters.searchChlorineParameters());

    this.store
      .select('chlorineParametersState')
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
