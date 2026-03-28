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
  TypeMaintenanceEnum,
  KeyValueTypeMaintenance,
  NotificationProfileEnum,
  FrequencyMaintenanceEnum,
  KeyValueNotificationProfile,
  KeyValueFrequencyMaintenance,
  StatusMaintenanceScheduleEnum,
  KeyValueStatusMaintenanceSchedule,
  MaintenanceSchedule,
  EventFilters,
} from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as maintenanceScheduleStore from 'src/app/store/actions/maintenance-schedule.actions';
import { ScheduleCreateComponent } from '../schedule-create/schedule-create.component';

@Component({
  providers: [DialogService],
  selector: 'app-schedule-consult',
  templateUrl: './schedule-consult.component.html',
  styles: [],
  standalone: true,
  imports: [TableModule, SharedModule, ButtonModule, TooltipModule, MultiSelectModule, DatePipe],
})
export class ScheduleConsultComponent extends BaseResourceListComponent<MaintenanceSchedule.Model> implements OnInit {
  refMaintenanceSchedule!: DynamicDialogRef;

  typeMaintenanceEnum: SelectItem[] = [];
  notificationProfileEnum: SelectItem[] = [];
  statusMaintenanceScheduleEnum: SelectItem[] = [];
  frequencyMaintenanceScheduleEnum: SelectItem[] = [];

  keyValueTypeMaintenance = new KeyValueTypeMaintenance();
  keyValueNotificationProfile = new KeyValueNotificationProfile();
  keyValueFrequencyMaintenance = new KeyValueFrequencyMaintenance();
  keyValueStatusMaintenanceSchedule = new KeyValueStatusMaintenanceSchedule();

  constructor(protected override injector: Injector, protected dialogServiceMaintenanceSchedule: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.typeMaintenanceEnum = this.setEnumValues(TypeMaintenanceEnum);
    this.notificationProfileEnum = this.setEnumValues(NotificationProfileEnum);
    this.frequencyMaintenanceScheduleEnum = this.setEnumValues(FrequencyMaintenanceEnum);
    this.statusMaintenanceScheduleEnum = this.setEnumValues(StatusMaintenanceScheduleEnum);
  }

  public override openNew() {
    this.store.dispatch(maintenanceScheduleStore.isEditingMaintenanceSchedule({ isEditing: false }));
    this.openDialogMaintenanceSchedule();
  }

  public override editResource(payload: MaintenanceSchedule.Model) {
    this.store.dispatch(maintenanceScheduleStore.isEditingMaintenanceSchedule({ isEditing: true }));
    this.openDialogMaintenanceSchedule(payload);
  }

  protected override delete(payload: number) {
    this.store.dispatch(maintenanceScheduleStore.deleteMaintenanceSchedule({ payload }));
  }

  protected openDialogMaintenanceSchedule(maintenanceSchedule?: MaintenanceSchedule.Model) {
    this.refMaintenanceSchedule = this.dialogServiceMaintenanceSchedule.open(ScheduleCreateComponent, {
      width: '55%',
      baseZIndex: 1000,
      closeOnEscape: false,
      data: maintenanceSchedule,
      header: 'Agenda de Manuteção',
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(maintenanceScheduleStore.setParamsMaintenanceSchedules({ params }));
    this.store.dispatch(maintenanceScheduleStore.searchMaintenanceSchedule());

    this.store
      .select('maintenanceScheduleState')
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
