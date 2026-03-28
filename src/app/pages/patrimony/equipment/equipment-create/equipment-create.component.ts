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
  StatusEnum,
  KeyValueEquipment,
  StatusEquipmentEnum,
  VoltageEquipmentEnum,
  KeyValueStatusVoltage,
  Provider,
  Options,
} from 'src/app/models';
import { Equipment } from 'src/app/models';
import { CustomValidator, getTimezone } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';

import * as actionsEquipment from 'src/app/store/actions/equipment.actions';
import * as actionsProvider from 'src/app/store/actions/providers.actions';
import { HistoricalComponent } from '../../../../shared/components/historical/historical.component';
import { MaintenanceComponent } from '../../../../shared/components/maintenances/maintenance.component';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-equipment-create',
  templateUrl: './equipment-create.component.html',
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
    InputTextModule,
    DropdownModule,
    NgxMaskDirective,
    InputNumberModule,
    CalendarModule,
    MaintenanceComponent,
    HistoricalComponent,
    InputTextareaModule,
    ButtonModule,
  ],
})
export class EquipmentCreateComponent extends BaseResourceFormComponent<Equipment.Model> implements OnInit {
  providers: Options.Dropdown[] = [];
  statusEquipmentEnum: SelectItem[] = [];
  voltageEquipmentEnum: SelectItem[] = [];
  keyValueModel = new KeyValueEquipment();
  keyValueVoltage = new KeyValueStatusVoltage();

  activeIndex: number = 0;

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllProviders();
    this.statusEquipmentEnum = this.setEnumValues(StatusEquipmentEnum);
    this.voltageEquipmentEnum = this.setEnumValues(VoltageEquipmentEnum);

    this.store
      .select('equipmentState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsEquipment.createEquipment({ payload: this.toEquipmentModel() }));
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(actionsEquipment.updateEquipment({ uuid, payload: this.toEquipmentModel() }));
      }

      this.store
        .select('equipmentState')
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

  public override reset(): void {
    this.ref.close();
  }

  protected searchAllProviders() {
    this.store.dispatch(actionsProvider.searchProvider());

    this.store
      .select('providerState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ provider }) => {
        if (!this.objectIsEmpty(provider)) {
          const data = provider.sort((a: Provider.Model, b: Provider.Model) => {
            return a.name < b.name ? -1 : 1;
          });
          this.providers = data.map((m: Provider.Model) => ({
            id: m.id,
            name: m.name,
            inactive: m.statusProvider === this.getValueKeyStatusByEnum(StatusEnum.Active) ? false : true,
          }));
        }
      });
  }

  protected toEquipmentModel() {
    const equipmentDTO: Equipment.Input = {
      ...this.resourceForm.value,
      provider: { id: this.providerId.value },
      status: this.keyValueModel.getValue(this.status.value),
      voltage: this.keyValueVoltage.getValue(this.voltage.value),
    };

    return equipmentDTO;
  }

  protected patchValue() {
    const data = this.config.data;

    if (data) {
      let buyDate = null;
      let warrantyEnd = null;
      let arrivalDate = null;
      let warrantyStart = null;

      if (data.buyDate !== null) {
        buyDate = zonedTimeToUtc(data.buyDate, getTimezone());
      }

      if (data.warrantyEnd !== null) {
        warrantyEnd = zonedTimeToUtc(data.warrantyEnd, getTimezone());
      }

      if (data.arrivalDate !== null) {
        arrivalDate = zonedTimeToUtc(data.arrivalDate, getTimezone());
      }

      if (data.warrantyStart !== null) {
        warrantyStart = zonedTimeToUtc(data.warrantyStart, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        buyDate,
        warrantyEnd,
        arrivalDate,
        warrantyStart,
        status: this.keyValueModel.getKeyByValue(data.status),
        voltage: this.keyValueVoltage.getKeyByValue(data.voltage),
      });
      this.resourceForm.setControl('historical', this.formBuilder.array(data.historical || []));
      this.resourceForm.setControl('maintenances', this.formBuilder.array(data.maintenances || []));
    }
  }

  protected override buildResourceForm(): void {
    const buyDate = new FormControl();
    const warrantyStart = new FormControl();
    const arrivalDate = new FormControl(null, [CustomValidator.validDate(buyDate)]);
    const warrantyEnd = new FormControl(null, [CustomValidator.validDate(warrantyStart)]);
    const status = this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Active);

    this.resourceForm = this.formBuilder.group({
      uuid: [null],
      note: [null],
      buyDate: buyDate,
      arrivalDate: arrivalDate,
      warrantyEnd: warrantyEnd,
      totalMaintenance: [null],
      warrantyStart: warrantyStart,
      price: [null, [Validators.required]],
      voltage: [null, [Validators.required]],
      status: [status, [Validators.required]],
      patrimonyNumber: [null, [Validators.required]],
      description: [null, [Validators.required, CustomValidator.endsWithSpace(), CustomValidator.startsWithSpace()]],

      provider: this.formBuilder.group({
        name: [],
        id: [null, [Validators.required]],
      }),
      historical: this.formBuilder.array([]),
      maintenances: this.formBuilder.array([]),
    });
  }

  get uuid(): FormControl {
    return this.resourceForm.get('uuid') as FormControl;
  }

  get note(): FormControl {
    return this.resourceForm.get('note') as FormControl;
  }

  get arrivalDate(): FormControl {
    return this.resourceForm.get('arrivalDate') as FormControl;
  }

  get buyDate(): FormControl {
    return this.resourceForm.get('buyDate') as FormControl;
  }

  get warrantyEnd(): FormControl {
    return this.resourceForm.get('warrantyEnd') as FormControl;
  }

  get warrantyStart(): FormControl {
    return this.resourceForm.get('warrantyStart') as FormControl;
  }

  get price(): FormControl {
    return this.resourceForm.get('price') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get voltage(): FormControl {
    return this.resourceForm.get('voltage') as FormControl;
  }

  get totalMaintenance(): FormControl {
    return this.resourceForm.get('totalMaintenance') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }

  get historical(): FormControl {
    return this.resourceForm.get('historical') as FormControl;
  }

  get maintenances(): FormControl {
    return this.resourceForm.get('maintenances') as FormControl;
  }

  get providerId(): FormControl {
    return this.resourceForm.get('provider.id') as FormControl;
  }

  get patrimonyNumber(): FormControl {
    return this.resourceForm.get('patrimonyNumber') as FormControl;
  }
}
