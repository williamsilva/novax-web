import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { takeUntil } from 'rxjs';

import {
  ShiftEnum,
  DoserEnum,
  StatusEnum,
  MachineEnum,
  BrineTankEnum,
  FlowMeterEnum,
  KeyValueShift,
  WaterTankEnum,
  KeyValueDoser,
  KeyValueMachine,
  SaltFiltersEnum,
  KeyValueBrineTank,
  KeyValueFlowMeter,
  KeyValueWaterTank,
  KeyValueSaltFilters,
  Employee,
  Options,
} from 'src/app/models';
import { ChlorineParameters } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsChlorineParameters from 'src/app/store/actions/chlorine-parameters.actions';
import * as actionsEmployee from 'src/app/store/actions/employees.actions';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';

export interface Options {
  id: number;
  name: string;
  statusEmployee: string;
}

@Component({
  selector: 'app-chlorine-parameters-create',
  templateUrl: './chlorine-parameters-create.component.html',
  styles: [],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ErrorMsgComponent, DropdownModule, InputTextareaModule, ButtonModule],
})
export class ChlorineParametersCreateComponent
  extends BaseResourceFormComponent<ChlorineParameters.Model>
  implements OnInit
{
  shiftEnum: SelectItem[] = [];
  doserEnum: SelectItem[] = [];
  machineEnum: SelectItem[] = [];
  waterTankEnum: SelectItem[] = [];
  brineTankEnum: SelectItem[] = [];
  flowMeterEnum: SelectItem[] = [];
  saltFilterEnum: SelectItem[] = [];
  employees: Options.Dropdown[] = [];

  keyValueShift = new KeyValueShift();
  keyValueDoser = new KeyValueDoser();
  keyValueMachine = new KeyValueMachine();
  keyValueWaterTank = new KeyValueWaterTank();
  keyValueBrineTank = new KeyValueBrineTank();
  keyValueFlowMeter = new KeyValueFlowMeter();
  keyValueSaltFilter = new KeyValueSaltFilters();

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    this.searchAllEmployees();
    this.shiftEnum = this.setEnumValues(ShiftEnum);
    this.doserEnum = this.setEnumValues(DoserEnum);
    this.machineEnum = this.setEnumValues(MachineEnum);
    this.waterTankEnum = this.setEnumValues(WaterTankEnum);
    this.brineTankEnum = this.setEnumValues(BrineTankEnum);
    this.flowMeterEnum = this.setEnumValues(FlowMeterEnum);
    this.saltFilterEnum = this.setEnumValues(SaltFiltersEnum);

    this.store
      .select('chlorineParametersState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.setShiftField();
    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsChlorineParameters.createChlorineParameters({ payload: this.toChlorineModel() }));
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(
          actionsChlorineParameters.updateChlorineParameters({ uuid, payload: this.toChlorineModel() }),
        );
      }

      this.store
        .select('chlorineParametersState')
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

  protected toChlorineModel() {
    const chlorineDTO: ChlorineParameters.Input = {
      ...this.resourceForm.value,
      employee: { id: this.employeeId.value },
      shift: this.keyValueShift.getValue(this.shift.value),
      doser1: this.keyValueDoser.getValue(this.doser1.value),
      doser2: this.keyValueDoser.getValue(this.doser2.value),
      doser3: this.keyValueDoser.getValue(this.doser3.value),
      machine1: this.keyValueMachine.getValue(this.machine1.value),
      machine2: this.keyValueMachine.getValue(this.machine2.value),
      machine3: this.keyValueMachine.getValue(this.machine3.value),
      waterTank: this.keyValueWaterTank.getValue(this.waterTank.value),
      brineTank: this.keyValueBrineTank.getValue(this.brineTank.value),
      flowMeter1: this.keyValueFlowMeter.getValue(this.flowMeter1.value),
      flowMeter2: this.keyValueFlowMeter.getValue(this.flowMeter2.value),
      flowMeter3: this.keyValueFlowMeter.getValue(this.flowMeter3.value),
      saltFilter: this.keyValueSaltFilter.getValue(this.saltFilter.value),
    };
    return chlorineDTO;
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        shift: this.keyValueShift.getKeyByValue(data.shift),
        doser1: this.keyValueDoser.getKeyByValue(data.doser1),
        doser2: this.keyValueDoser.getKeyByValue(data.doser2),
        doser3: this.keyValueDoser.getKeyByValue(data.doser3),
        machine1: this.keyValueMachine.getKeyByValue(data.machine1),
        machine2: this.keyValueMachine.getKeyByValue(data.machine2),
        machine3: this.keyValueMachine.getKeyByValue(data.machine3),
        waterTank: this.keyValueWaterTank.getKeyByValue(data.waterTank),
        brineTank: this.keyValueBrineTank.getKeyByValue(data.brineTank),
        flowMeter1: this.keyValueFlowMeter.getKeyByValue(data.flowMeter1),
        flowMeter2: this.keyValueFlowMeter.getKeyByValue(data.flowMeter2),
        flowMeter3: this.keyValueFlowMeter.getKeyByValue(data.flowMeter3),
        saltFilter: this.keyValueSaltFilter.getKeyByValue(data.saltFilter),
      });
    }
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

  protected override buildResourceForm(): void {
    const doser = this.getKeyByValueEnum(DoserEnum, DoserEnum.Doser_20);
    const waterTank = this.getKeyByValueEnum(WaterTankEnum, WaterTankEnum.Full);
    const machine = this.getKeyByValueEnum(MachineEnum, MachineEnum.Machine_ok);
    const flowMeter = this.getKeyByValueEnum(FlowMeterEnum, FlowMeterEnum.Meter_120);
    const flowMeter2 = this.getKeyByValueEnum(FlowMeterEnum, FlowMeterEnum.Meter_150);
    const saltFilter = this.getKeyByValueEnum(SaltFiltersEnum, SaltFiltersEnum.In_good_conditions);

    this.resourceForm = this.formBuilder.group({
      uuid: [null],
      note: [null],
      shift: [null, [Validators.required]],
      doser1: [doser, [Validators.required]],
      doser2: [doser, [Validators.required]],
      doser3: [doser, [Validators.required]],
      brineTank: [null, [Validators.required]],
      machine1: [machine, [Validators.required]],
      machine2: [machine, [Validators.required]],
      machine3: [machine, [Validators.required]],
      waterTank: [waterTank, [Validators.required]],
      saltFilter: [saltFilter, [Validators.required]],
      flowMeter1: [flowMeter, [Validators.required]],
      flowMeter2: [flowMeter, [Validators.required]],
      flowMeter3: [flowMeter2, [Validators.required]],
      employee: this.formBuilder.group({
        name: [],
        id: [null, [Validators.required]],
      }),
    });
  }

  get uuid(): FormControl {
    return this.resourceForm.get('uuid') as FormControl;
  }

  get shift(): FormControl {
    return this.resourceForm.get('shift') as FormControl;
  }

  get note(): FormControl {
    return this.resourceForm.get('note') as FormControl;
  }

  get machine1(): FormControl {
    return this.resourceForm.get('machine1') as FormControl;
  }

  get machine2(): FormControl {
    return this.resourceForm.get('machine2') as FormControl;
  }

  get machine3(): FormControl {
    return this.resourceForm.get('machine3') as FormControl;
  }

  get doser1(): FormControl {
    return this.resourceForm.get('doser1') as FormControl;
  }

  get doser2(): FormControl {
    return this.resourceForm.get('doser2') as FormControl;
  }

  get doser3(): FormControl {
    return this.resourceForm.get('doser3') as FormControl;
  }

  get machine(): FormControl {
    return this.resourceForm.get('machine') as FormControl;
  }

  get cell(): FormControl {
    return this.resourceForm.get('cell') as FormControl;
  }

  get waterTank(): FormControl {
    return this.resourceForm.get('waterTank') as FormControl;
  }

  get saltFilter(): FormControl {
    return this.resourceForm.get('saltFilter') as FormControl;
  }

  get flowMeter1(): FormControl {
    return this.resourceForm.get('flowMeter1') as FormControl;
  }

  get flowMeter2(): FormControl {
    return this.resourceForm.get('flowMeter2') as FormControl;
  }

  get flowMeter3(): FormControl {
    return this.resourceForm.get('flowMeter3') as FormControl;
  }

  get brineTank(): FormControl {
    return this.resourceForm.get('brineTank') as FormControl;
  }

  get employeeId(): FormControl {
    return this.resourceForm.get('employee.id') as FormControl;
  }
}
