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
  TypeMaintenanceEnum,
  StatusMaintenanceEnum,
  KeyValueTypeMaintenance,
  KeyValueStatusMaintenance,
  Maintenance,
  Provider,
  Options,
} from 'src/app/models';
import { CustomValidator, getTimezone } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';

import * as actionsEquipment from 'src/app/store/actions/equipment.actions';
import * as actionsMaintenance from 'src/app/store/actions/maintenance.actions';
import * as providerStore from 'src/app/store/actions/providers.actions';
import { ErrorMsgComponent } from '../../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-carried-out-create',
  templateUrl: './carried-out-create.component.html',
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
export class CarriedOutCreateComponent extends BaseResourceFormComponent<Maintenance.Model> implements OnInit {
  activeIndex: number = 0;
  requiredPrice = false;
  requiredReturnDate = false;
  requiredWarrantyEnd = false;
  requiredWarrantyStart = false;

  providers: Options.Dropdown[] = [];
  typeMaintenanceEnum: SelectItem[] = [];
  statusMaintenanceEnum: SelectItem[] = [];
  keyValueModel = new KeyValueStatusMaintenance();
  keyValueTypeMaintenance = new KeyValueTypeMaintenance();

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
    this.typeMaintenanceEnum = this.setEnumValues(TypeMaintenanceEnum);
    this.statusMaintenanceEnum = this.setEnumValues(StatusMaintenanceEnum);

    this.store
      .select('maintenanceState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsMaintenance.createMaintenance({ payload: this.toMaintenanceModel() }));
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(actionsMaintenance.updateMaintenance({ uuid, payload: this.toMaintenanceModel() }));
      }

      this.store
        .select('maintenanceState')
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

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      let buyDate = null;
      let sendDate = null;
      let returnDate = null;
      let warrantyEnd = null;
      let warrantyStart = null;

      if (data.returnDate !== null) {
        returnDate = zonedTimeToUtc(data.returnDate, getTimezone());
      }

      if (data.sendDate !== null) {
        sendDate = zonedTimeToUtc(data.sendDate, getTimezone());
      }

      if (data.warrantyEnd !== null) {
        warrantyEnd = zonedTimeToUtc(data.warrantyEnd, getTimezone());
      }

      if (data.warrantyStart !== null) {
        warrantyStart = zonedTimeToUtc(data.warrantyStart, getTimezone());
      }

      if (data.equipment.buyDate !== null) {
        buyDate = zonedTimeToUtc(data.equipment.buyDate, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        sendDate,
        returnDate,
        warrantyEnd,
        warrantyStart,
        status: this.keyValueModel.getKeyByValue(data.status),
        typeMaintenance: this.keyValueTypeMaintenance.getKeyByValue(data.typeMaintenance),
        equipment: {
          buyDate,
        },
      });
    }

    this.validMethodsByStatus();
  }

  public validMethodsByStatus() {
    this.validFieldPrice();
    this.validFieldReturnDate();
    this.validFieldWarrantyEnd();
    this.validFieldWarrantyStart();
  }

  public findByPatrimonyNumber(): void {
    const equipmentNumberValue = this.equipmentNumber.value;

    if (this.equipmentNumber.valid && equipmentNumberValue) {
      const paramsPatrimony = equipmentNumberValue;
      this.store.dispatch(actionsEquipment.setParamsPatrimony({ paramsPatrimony }));
      this.store.dispatch(actionsEquipment.searchPatrimony());

      this.store
        .select('equipmentState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ equipment }) => {
          if (equipment.id !== 0) {
            this.updateEquipmentFields(equipment);
          } else {
            this.resetEquipmentFields(true);
          }
        });
    } else {
      this.resetEquipmentFields(false);
    }
  }

  protected updateEquipmentFields(equipment: any): void {
    const buyDate = equipment.buyDate ? zonedTimeToUtc(equipment.buyDate, getTimezone()) : null;

    this.equipmentId.setValue(equipment.id);
    this.equipmentBuyDate.setValue(buyDate);
    this.equipmentPrice.setValue(equipment.price);
    this.equipmentDescription.setValue(equipment.description);

    this.equipmentNumber.clearValidators();
    this.equipmentNumber.updateValueAndValidity();
  }

  protected resetEquipmentFields(setNoDataError: boolean): void {
    if (setNoDataError) {
      this.equipmentNumber.setErrors({ noData: true });
    } else {
      this.equipmentNumber.setErrors({ required: true });
    }

    this.equipmentId.setValue(null);
    this.equipmentPrice.setValue(null);
    this.equipmentBuyDate.setValue(null);
    this.equipmentDescription.setValue(null);
  }

  protected toMaintenanceModel() {
    const maintenanceDTO: Maintenance.Input = {
      ...this.resourceForm.value,
      equipment: { id: this.equipmentId.value },
      authorized: { id: this.authorizedId.value },
      status: this.keyValueModel.getValue(this.status.value),
      typeMaintenance: this.keyValueTypeMaintenance.getValue(this.typeMaintenance.value),
    };

    return maintenanceDTO;
  }

  protected searchAllProviders() {
    this.store.dispatch(providerStore.searchProvider());

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

  protected override buildResourceForm(): void {
    const sendDate = new FormControl(new Date(), Validators.required);
    const returnDate = new FormControl('', [CustomValidator.validDate(sendDate)]);
    const warrantyStart = new FormControl('', [CustomValidator.validDate(returnDate)]);
    const warrantyEnd = new FormControl('', [CustomValidator.validDate(warrantyStart)]);
    const status = this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Budget);

    this.resourceForm = this.formBuilder.group({
      uuid: [null],
      note: [null],
      price: [null],
      status: [status],
      sendDate: sendDate,
      returnDate: returnDate,
      warrantyEnd: warrantyEnd,
      warrantyStart: warrantyStart,
      typeMaintenance: [null, [Validators.required]],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          CustomValidator.endsWithSpace(),
          CustomValidator.startsWithSpace(),
        ],
      ],
      equipment: this.formBuilder.group({
        id: [],
        price: [{ value: '', disabled: true }],
        buyDate: [{ value: '', disabled: true }],
        description: [{ value: '', disabled: true }],
        patrimonyNumber: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      }),
      authorized: this.formBuilder.group({
        name: [],
        id: [null, Validators.required],
      }),
    });
  }

  protected validFieldWarrantyEnd() {
    const statusMaintenance = this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Received);
    if (this.status.value === statusMaintenance) {
      this.requiredWarrantyEnd = false;
      this.warrantyEnd.enable();
      this.warrantyEnd.setValidators([
        CustomValidator.validDate(this.returnDate),
        CustomValidator.validDate(this.warrantyStart),
      ]);
    } else {
      this.requiredWarrantyEnd = false;
      this.warrantyEnd.disable();
      this.warrantyEnd.reset();
    }
  }

  protected validFieldWarrantyStart() {
    const statusMaintenance = this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Received);
    if (this.status.value === statusMaintenance) {
      this.requiredWarrantyStart = false;
      this.warrantyStart.enable();
      this.warrantyStart.setValidators([CustomValidator.validDate(this.returnDate)]);
    } else {
      this.requiredWarrantyStart = false;
      this.warrantyStart.disable();
      this.warrantyStart.reset();
    }
  }

  protected validFieldReturnDate() {
    const statusMaintenance = this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Received);
    if (this.status.value === statusMaintenance) {
      this.requiredReturnDate = true;
      this.returnDate.enable();
      this.returnDate.setValidators([Validators.required]);
      this.returnDate.setValidators([Validators.required, CustomValidator.validDate(this.sendDate)]);
      this.returnDate.updateValueAndValidity();
    } else {
      this.requiredReturnDate = false;
      this.returnDate.disable();
      this.returnDate.reset();
    }
  }

  protected validFieldPrice() {
    const statusMaintenance = this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Budget);
    if (this.status.value === statusMaintenance) {
      this.requiredPrice = false;
      this.price.disable();
      this.price.reset();
    } else {
      this.requiredPrice = true;
      this.price.enable();
      this.price.setValidators([Validators.required]);
      this.price.updateValueAndValidity();
    }
  }

  get price(): FormControl {
    return this.resourceForm.get('price') as FormControl;
  }

  get note(): FormControl {
    return this.resourceForm.get('note') as FormControl;
  }

  get sendDate(): FormControl {
    return this.resourceForm.get('sendDate') as FormControl;
  }

  get returnDate(): FormControl {
    return this.resourceForm.get('returnDate') as FormControl;
  }

  get warrantyEnd(): FormControl {
    return this.resourceForm.get('warrantyEnd') as FormControl;
  }

  get warrantyStart(): FormControl {
    return this.resourceForm.get('warrantyStart') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get typeMaintenance(): FormControl {
    return this.resourceForm.get('typeMaintenance') as FormControl;
  }

  get authorizedId(): FormControl {
    return this.resourceForm.get('authorized.id') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }

  get equipmentId(): FormControl {
    return this.resourceForm.get('equipment.id') as FormControl;
  }

  get equipmentPrice(): FormControl {
    return this.resourceForm.get('equipment.price') as FormControl;
  }

  get equipmentBuyDate(): FormControl {
    return this.resourceForm.get('equipment.buyDate') as FormControl;
  }

  get equipmentNumber(): FormControl {
    return this.resourceForm.get('equipment.patrimonyNumber') as FormControl;
  }

  get equipmentDescription(): FormControl {
    return this.resourceForm.get('equipment.description') as FormControl;
  }
}
