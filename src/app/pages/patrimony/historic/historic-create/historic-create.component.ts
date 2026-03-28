import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { zonedTimeToUtc } from 'date-fns-tz';
import { NgxMaskDirective } from 'ngx-mask';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { takeUntil } from 'rxjs';

import { Historic, KeyValueHistoric, Location, Options, StatusEnum, StatusHistoricEnum } from 'src/app/models';
import { CustomValidator, getTimezone } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsEquipment from 'src/app/store/actions/equipment.actions';
import * as actionsHistoric from 'src/app/store/actions/historic.actions';
import * as actionsLocation from 'src/app/store/actions/location.actions';

import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-historic-create',
  templateUrl: './historic-create.component.html',
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
    ErrorMsgComponent,
    NgxMaskDirective,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    ButtonModule,
  ],
})
export class HistoricCreateComponent extends BaseResourceFormComponent<Historic.Model> implements OnInit {
  requiredFinalDate = false;

  locations: Options.Dropdown[] = [];
  statusHistoricEnum: SelectItem[] = [];
  keyValueModel = new KeyValueHistoric();

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllLocations();
    this.statusHistoricEnum = this.setEnumValues(StatusHistoricEnum);

    this.store
      .select('historicState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsHistoric.createHistoric({ payload: this.toHistoricModel() }));
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(actionsHistoric.updateHistoric({ uuid, payload: this.toHistoricModel() }));
      }

      this.store
        .select('historicState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ isLoading, success }) => {
          this.loading = isLoading;
          if (success) {
            this.reset();
          }
        });
    } else {
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  public override reset(): void {
    this.ref.close();
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
          if (equipment.id != 0) {
            this.equipmentId.setValue(equipment.id);
            this.equipmentDescription.setValue(equipment.description);

            this.equipmentNumber.clearValidators();
            this.equipmentNumber.updateValueAndValidity();
          } else {
            this.equipmentNumber.setErrors({ noData: true });

            this.equipmentId.setValue(null);
            this.equipmentDescription.setValue(null);
          }
        });
    }
  }

  public validMethodsByStatus() {
    this.validFieldFinalDate();
  }

  protected searchAllLocations() {
    this.store.dispatch(actionsLocation.searchAllLocation());

    this.store
      .select('locationState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ location }) => {
        if (!this.objectIsEmpty(location)) {
          const data = location.sort((a: Location.Model, b: Location.Model) => {
            return a.description < b.description ? -1 : 1;
          });
          this.locations = data.map((m: Location.Model) => ({
            id: m.id,
            name: m.description,
            inactive: false,
          }));
        }
      });
  }

  protected toHistoricModel() {
    const voucherDTO: Historic.Input = {
      ...this.resourceForm.value,
      location: { id: this.locationId.value },
      equipment: { id: this.equipmentId.value },
      status: this.keyValueModel.getValue(this.status.value),
    };

    return voucherDTO;
  }

  protected patchValue() {
    const data = this.config.data;

    if (data) {
      let finalDate = null;
      let initialDate = null;

      if (data.finalDate !== null) {
        finalDate = zonedTimeToUtc(data.finalDate, getTimezone());
      }

      if (data.initialDate !== null) {
        initialDate = zonedTimeToUtc(data.initialDate, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        finalDate,
        initialDate,
        status: this.keyValueModel.getKeyByValue(data.status),
      });
      this.locationId.disable();
    }
    this.validMethodsByStatus();
  }

  protected override buildResourceForm(): void {
    const status = this.getKeyByValueEnum(StatusHistoricEnum, StatusHistoricEnum.Active);

    this.resourceForm = this.formBuilder.group({
      note: [null],
      finalDate: [null],
      status: [status, [Validators.required]],
      initialDate: [null, [Validators.required]],
      location: this.formBuilder.group({
        description: [],
        id: [null, [Validators.required]],
      }),
      equipment: this.formBuilder.group({
        id: [],
        description: [{ value: '', disabled: true }],
        patrimonyNumber: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      }),
    });
  }

  protected validFieldFinalDate() {
    const statusHistoric = this.getKeyByValueEnum(StatusEnum, StatusEnum.Active);

    if (this.status.value === statusHistoric) {
      this.requiredFinalDate = false;
      this.finalDate.disable();
      this.finalDate.reset();
    } else {
      this.requiredFinalDate = true;
      this.finalDate.enable();
      this.finalDate.setValidators([Validators.required, CustomValidator.validDate(this.initialDate)]);
      this.finalDate.updateValueAndValidity();
    }
  }

  get note(): FormControl {
    return this.resourceForm.get('note') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get finalDate(): FormControl {
    return this.resourceForm.get('finalDate') as FormControl;
  }

  get initialDate(): FormControl {
    return this.resourceForm.get('initialDate') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }

  get locationId(): FormControl {
    return this.resourceForm.get('location.id') as FormControl;
  }

  get equipmentId(): FormControl {
    return this.resourceForm.get('equipment.id') as FormControl;
  }

  get equipmentNumber(): FormControl {
    return this.resourceForm.get('equipment.patrimonyNumber') as FormControl;
  }

  get equipmentDescription(): FormControl {
    return this.resourceForm.get('equipment.description') as FormControl;
  }
}
