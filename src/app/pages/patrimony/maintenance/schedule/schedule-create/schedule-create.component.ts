import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { zonedTimeToUtc } from 'date-fns-tz';
import { NgxMaskDirective } from 'ngx-mask';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
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
} from 'src/app/models';
import { getTimezone } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsEquipment from 'src/app/store/actions/equipment.actions';
import * as actionsMaintenanceSchedule from 'src/app/store/actions/maintenance-schedule.actions';

import { ErrorMsgComponent } from '../../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    ErrorMsgComponent,
    NgxMaskDirective,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
  ],
})
export class ScheduleCreateComponent extends BaseResourceFormComponent<MaintenanceSchedule.Model> implements OnInit {
  activeIndex: number = 0;
  typeMaintenanceEnum: SelectItem[] = [];
  frequencyMaintenanceEnum: SelectItem[] = [];
  statusMaintenanceScheduleEnum: SelectItem[] = [];
  notificationProfileMaintenanceEnum: SelectItem[] = [];
  keyValueTypeMaintenance = new KeyValueTypeMaintenance();
  keyValueNotificationProfile = new KeyValueNotificationProfile();
  keyValueFrequencyMaintenance = new KeyValueFrequencyMaintenance();
  keyValueStatusMaintenanceSchedule = new KeyValueStatusMaintenanceSchedule();

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.typeMaintenanceEnum = this.setEnumValues(TypeMaintenanceEnum);
    this.frequencyMaintenanceEnum = this.setEnumValues(FrequencyMaintenanceEnum);
    this.notificationProfileMaintenanceEnum = this.setEnumValues(NotificationProfileEnum);
    this.statusMaintenanceScheduleEnum = this.setEnumValues(StatusMaintenanceScheduleEnum);

    this.store
      .select('maintenanceScheduleState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public override submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(
          actionsMaintenanceSchedule.createMaintenanceSchedule({ payload: this.toMaintenanceScheduleModel() }),
        );
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(
          actionsMaintenanceSchedule.updateMaintenanceSchedule({ uuid, payload: this.toMaintenanceScheduleModel() }),
        );
      }

      this.store
        .select('maintenanceScheduleState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ isLoading, success }) => {
          this.loading = isLoading;
          if (success) {
            this.reset();
          }
        });
    } else {
      this.activeIndex = 0;
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  public findByPatrimonyNumber() {
    if (this.equipmentNumber.valid && this.equipmentNumber.value !== null) {
      const paramsPatrimony = this.equipmentNumber.value;

      this.store.dispatch(actionsEquipment.setParamsPatrimony({ paramsPatrimony }));
      this.store.dispatch(actionsEquipment.searchPatrimony());

      this.store
        .select('equipmentState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ equipment }) => {
          if (!this.objectIsEmpty(equipment)) {
            let buyDate = null;
            if (equipment.buyDate !== undefined) {
              buyDate = zonedTimeToUtc(equipment.buyDate, getTimezone());
            }
            this.equipmentId.setValue(equipment.id);
            this.equipmentBuyDate.setValue(buyDate);
            this.equipmentPrice.setValue(equipment.price);
            this.equipmentDescription.setValue(equipment.description);

            this.equipmentNumber.clearValidators();
            this.equipmentNumber.updateValueAndValidity();
          } else {
            this.equipmentNumber.setErrors({ noData: true });

            this.equipmentId.setValue(null);
            this.equipmentPrice.setValue(null);
            this.equipmentBuyDate.setValue(null);
            this.equipmentDescription.setValue(null);
          }
        });
    }
  }

  public validMethodsByStatus() {}

  protected toMaintenanceScheduleModel() {
    const scheduleDTO: MaintenanceSchedule.Input = {
      ...this.resourceForm.value,
      equipment: { id: this.equipmentId.value },
      status: this.keyValueStatusMaintenanceSchedule.getValue(this.status.value),
      frequency: this.keyValueFrequencyMaintenance.getValue(this.frequency.value),
      typeMaintenance: this.keyValueTypeMaintenance.getValue(this.typeMaintenance.value),
      notificationProfile: this.keyValueNotificationProfile.getValue(this.notificationProfile.value),
    };

    return scheduleDTO;
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      let buyDate = null;
      let lastMaintenance = null;
      let nextMaintenance = null;

      if (data.nextMaintenance !== null) {
        nextMaintenance = zonedTimeToUtc(data.nextMaintenance, getTimezone());
      }

      if (data.equipment.lastMaintenance !== null) {
        lastMaintenance = zonedTimeToUtc(data.equipment.lastMaintenance, getTimezone());
      }

      if (data.equipment.buyDate !== null) {
        buyDate = zonedTimeToUtc(data.equipment.buyDate, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        nextMaintenance,
        frequency: this.keyValueFrequencyMaintenance.getKeyByValue(data.frequency),
        status: this.keyValueStatusMaintenanceSchedule.getKeyByValue(data.status),
        typeMaintenance: this.keyValueTypeMaintenance.getKeyByValue(data.typeMaintenance),
        notificationProfile: this.keyValueNotificationProfile.getKeyByValue(data.notificationProfile),
        equipment: {
          buyDate,
          lastMaintenance,
        },
      });
    }
  }

  public override reset(): void {
    this.ref.close();
  }

  protected override buildResourceForm(): void {
    const status = this.getKeyByValueEnum(StatusMaintenanceScheduleEnum, StatusMaintenanceScheduleEnum.Scheduled);

    this.resourceForm = this.formBuilder.group({
      uuid: [null],
      note: [null],
      status: [status],
      nextMaintenance: [],
      frequency: [null, [Validators.required]],
      typeMaintenance: [null, [Validators.required]],

      notificationProfile: [null, [Validators.required]],
      equipment: this.formBuilder.group({
        id: [],
        price: [{ value: '', disabled: true }],
        buyDate: [{ value: '', disabled: true }],
        description: [{ value: '', disabled: true }],
        lastMaintenance: [{ value: '', disabled: true }],
        patrimonyNumber: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      }),
    });
  }

  get note(): FormControl {
    return this.resourceForm.get('note') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get frequency(): FormControl {
    return this.resourceForm.get('frequency') as FormControl;
  }

  get nextMaintenance(): FormControl {
    return this.resourceForm.get('nextMaintenance') as FormControl;
  }

  get equipmentId(): FormControl {
    return this.resourceForm.get('equipment.id') as FormControl;
  }

  get typeMaintenance(): FormControl {
    return this.resourceForm.get('typeMaintenance') as FormControl;
  }

  get notificationProfile(): FormControl {
    return this.resourceForm.get('notificationProfile') as FormControl;
  }

  get equipmentPrice(): FormControl {
    return this.resourceForm.get('equipment.price') as FormControl;
  }

  get equipmentNumber(): FormControl {
    return this.resourceForm.get('equipment.patrimonyNumber') as FormControl;
  }

  get equipmentBuyDate(): FormControl {
    return this.resourceForm.get('equipment.buyDate') as FormControl;
  }

  get equipmentDescription(): FormControl {
    return this.resourceForm.get('equipment.description') as FormControl;
  }

  get lastMaintenance(): FormControl {
    return this.resourceForm.get('equipment.lastMaintenance') as FormControl;
  }
}
