import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { takeUntil } from 'rxjs';

import {
  PhEnum,
  PoolEnum,
  ShiftEnum,
  KeyValuePh,
  StatusEnum,
  KeyValuePool,
  ChlorineEnum,
  KeyValueShift,
  AlkalinityEnum,
  KeyValueChlorine,
  KeyValueAlkalinity,
  Employee,
  TypeEnum,
  Options,
} from 'src/app/models';
import { PoolParameters } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsEmployee from 'src/app/store/actions/employees.actions';
import * as actionsPoolParameters from 'src/app/store/actions/pool-parameters.actions';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-pool-parameters-create',
  templateUrl: './pool-parameters-create.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ErrorMsgComponent, DropdownModule, InputTextareaModule, ButtonModule],
})
export class PoolParametersCreateComponent
  extends BaseResourceFormComponent<PoolParameters.Model>
  implements OnInit, OnDestroy
{
  phEnum: SelectItem[] = [];
  shiftEnum: SelectItem[] = [];
  poolEnum: TypeEnum.Model[] = [];
  chlorineEnum: SelectItem[] = [];
  alkalinityEnum: SelectItem[] = [];
  employees: Options.Dropdown[] = [];
  alreadyCarriedOut: PoolParameters.Model[] = [];

  keyValuePh = new KeyValuePh();
  keyValuePool = new KeyValuePool();
  keyValueShift = new KeyValueShift();
  keyValueChlorine = new KeyValueChlorine();
  keyValueAlkalinity = new KeyValueAlkalinity();

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.searchForPoolsWithParameters();

    this.setPoolEnum();
    this.searchAllEmployees();
    this.phEnum = this.setEnumValues(PhEnum);
    this.shiftEnum = this.setEnumValues(ShiftEnum);
    this.chlorineEnum = this.setEnumValues(ChlorineEnum);
    this.alkalinityEnum = this.setEnumValues(AlkalinityEnum);

    this.store
      .select('poolParametersState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.setShiftField();
    this.patchValue();
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();

    this.store.dispatch(actionsPoolParameters.setParamsPoolShift({ shiftParams: [this.getShiftParams()] }));
    this.store.dispatch(actionsPoolParameters.searchPoolParametersByShift());
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsPoolParameters.createPoolParameters({ payload: this.toPoolParametersModel() }));
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(
          actionsPoolParameters.updatePoolParameters({ uuid, payload: this.toPoolParametersModel() }),
        );
      }

      this.store
        .select('poolParametersState')
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

  protected setShiftField() {
    if (this.timeIsWithinInterval('07:00', '09:59')) {
      this.shift.patchValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.First));
    } else if (this.timeIsWithinInterval('10:00', '13:59')) {
      this.shift.patchValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Second));
    } else if (this.timeIsWithinInterval('14:00', '17:59')) {
      this.shift.patchValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Third));
    } else {
      this.shift.patchValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Not_configured));
    }
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

  protected searchForPoolsWithParameters() {
    this.store
      .select('poolParametersState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ poolParameters }) => {
        if (!this.objectIsEmpty(poolParameters)) {
          this.alreadyCarriedOut = poolParameters;
        }
      });
  }

  protected setPoolEnum() {
    const shift = this.setEnumValues(PoolEnum);
    this.poolEnum = shift.map((m: TypeEnum.Model) => ({
      value: m.value,
      label: m.label,
      inactive: this.checkIfThisInArray(m.value),
    }));
  }

  protected checkIfThisInArray(value: string): boolean {
    return this.alreadyCarriedOut.some((object) => this.keyValuePool.getKeyByValue(object.pool) === value);
  }

  protected searchAllEmployees() {
    this.store.dispatch(actionsEmployee.searchEmployees());

    this.store
      .select('employeeState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ employee }) => {
        if (!this.objectIsEmpty(employee)) {
          const data = employee.sort((a: Employee.Model, b: Employee.Model) => {
            // Primeiro, comparamos o status
            if (a.statusEmployee < b.statusEmployee) {
              return -1; // a deve vir antes de b
            } else if (a.statusEmployee > b.statusEmployee) {
              return 1; // b deve vir antes de a
            } else {
              // Se os status forem iguais, comparamos os nomes
              return a.name < b.name ? -1 : 1;
            }
          });

          this.employees = data.map((m: Employee.Model) => ({
            id: m.id,
            name: m.name,
            inactive: m.statusEmployee === this.getValueKeyStatusByEnum(StatusEnum.Active) ? false : true,
          }));
        }
      });
  }

  protected toPoolParametersModel() {
    const poolParametersDTO: PoolParameters.Input = {
      ...this.resourceForm.value,
      employee: { id: this.employeeId.value },
      ph: this.keyValuePh.getValue(this.ph.value),
      pool: this.keyValuePool.getValue(this.pool.value),
      shift: this.keyValueShift.getValue(this.shift.value),
      chlorine: this.keyValueChlorine.getValue(this.chlorine.value),
      alkalinity: this.keyValueAlkalinity.getValue(this.alkalinity.value),
    };

    return poolParametersDTO;
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        ph: this.keyValuePh.getKeyByValue(data.ph),
        pool: this.keyValuePool.getKeyByValue(data.pool),
        shift: this.keyValueShift.getKeyByValue(data.shift),
        chlorine: this.keyValueChlorine.getKeyByValue(data.chlorine),
        alkalinity: this.keyValueAlkalinity.getKeyByValue(data.alkalinity),
      });
    }
  }

  protected override buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      uuid: [null],
      note: [null],
      ph: [null, [Validators.required]],
      pool: [null, [Validators.required]],
      shift: [null, [Validators.required]],
      chlorine: [null, [Validators.required]],
      alkalinity: [null, [Validators.required]],
      employee: this.formBuilder.group({
        name: [],
        id: [null, [Validators.required]],
      }),
    });
  }

  get ph(): FormControl {
    return this.resourceForm.get('ph') as FormControl;
  }

  get shift(): FormControl {
    return this.resourceForm.get('shift') as FormControl;
  }

  get alkalinity(): FormControl {
    return this.resourceForm.get('alkalinity') as FormControl;
  }

  get chlorine(): FormControl {
    return this.resourceForm.get('chlorine') as FormControl;
  }

  get uuid(): FormControl {
    return this.resourceForm.get('uuid') as FormControl;
  }

  get pool(): FormControl {
    return this.resourceForm.get('pool') as FormControl;
  }

  get note(): FormControl {
    return this.resourceForm.get('note') as FormControl;
  }

  get employeeId(): FormControl {
    return this.resourceForm.get('employee.id') as FormControl;
  }
}
