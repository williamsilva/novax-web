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
  PhEnum,
  PoolEnum,
  ShiftEnum,
  KeyValuePh,
  ChlorineEnum,
  KeyValuePool,
  KeyValueShift,
  AlkalinityEnum,
  KeyValueChlorine,
  KeyValueAlkalinity,
  PoolParameters,
  EventFilters,
} from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as actionsPoolParameters from 'src/app/store/actions/pool-parameters.actions';
import { PoolParametersCreateComponent } from '../pool-parameters-create';

@Component({
  providers: [DialogService],
  selector: 'app-pool-parameters-consult',
  templateUrl: './pool-parameters-consult.component.html',
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
export class PoolParametersConsultComponent extends BaseResourceListComponent<PoolParameters.Model> implements OnInit {
  phEnum: SelectItem[] = [];
  poolEnum: SelectItem[] = [];
  shiftEnum: SelectItem[] = [];
  chlorineEnum: SelectItem[] = [];
  alkalinityEnum: SelectItem[] = [];

  refPoolParameters!: DynamicDialogRef;

  keyValuePh = new KeyValuePh();
  keyValuePool = new KeyValuePool();
  keyValueShift = new KeyValueShift();
  keyValueChlorine = new KeyValueChlorine();
  keyValueAlkalinity = new KeyValueAlkalinity();

  constructor(protected override injector: Injector, protected dialogServicePoolParameters: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.phEnum = this.setEnumValues(PhEnum);
    this.poolEnum = this.setEnumValues(PoolEnum);
    this.shiftEnum = this.setEnumValues(ShiftEnum);
    this.chlorineEnum = this.setEnumValues(ChlorineEnum);
    this.alkalinityEnum = this.setEnumValues(AlkalinityEnum);

    this.store.dispatch(actionsPoolParameters.setParamsPoolShift({ shiftParams: [this.getShiftParams()] }));
    this.store.dispatch(actionsPoolParameters.searchPoolParametersByShift());
  }

  public override openNew() {
    this.store.dispatch(actionsPoolParameters.isEditingPoolParameters({ isEditing: false }));
    this.openDialogPoolParameters();
  }

  public override editResource(payload: PoolParameters.Model) {
    this.store.dispatch(actionsPoolParameters.isEditingPoolParameters({ isEditing: true }));
    this.openDialogPoolParameters(payload);
  }

  protected getShiftParams() {
    if (this.timeIsWithinInterval('07:00', '09:59')) {
      return this.getKeyByValueEnum(ShiftEnum, ShiftEnum.First);
    } else if (this.timeIsWithinInterval('10:00', '13:59')) {
      return this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Second);
    } else if (this.timeIsWithinInterval('14:00', '17:59')) {
      return this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Third);
    } else {
      return this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Not_configured);
    }
  }

  protected timeIsWithinInterval(startTime: string, horaFim: string): boolean {
    const currentDate: Date = new Date();
    const currentTime: number = currentDate.getHours();
    const minutesCurrent: number = currentDate.getMinutes();

    const timeStartArray: number[] = startTime.split(':').map(Number);
    const horaFimArray: number[] = horaFim.split(':').map(Number);

    const timeStartInMinutes: number = timeStartArray[0] * 60 + timeStartArray[1];
    const timeEndInMinutes: number = horaFimArray[0] * 60 + horaFimArray[1];
    const currentTimeInMinutes: number = currentTime * 60 + minutesCurrent;

    return currentTimeInMinutes >= timeStartInMinutes && currentTimeInMinutes <= timeEndInMinutes;
  }

  protected override delete(payload: number) {
    this.store.dispatch(actionsPoolParameters.deletePoolParameters({ payload }));
  }

  protected openDialogPoolParameters(poolParameters?: PoolParameters.Model) {
    this.refPoolParameters = this.dialogServicePoolParameters.open(PoolParametersCreateComponent, {
      width: '55%',
      baseZIndex: 1000,
      data: poolParameters,
      closeOnEscape: false,
      header: 'Parâmetros',
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(actionsPoolParameters.setParamsPoolParameters({ params }));
    this.store.dispatch(actionsPoolParameters.searchPoolParameters());

    this.store
      .select('poolParametersState')
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
