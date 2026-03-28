import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { zonedTimeToUtc } from 'date-fns-tz';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { takeUntil } from 'rxjs';
import * as moment from 'moment';

import { CustomValidator, getTimezone } from 'src/app/shared';
import { Employee, Fleets, Options, StatusEnum } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsFleets from 'src/app/store/actions/fleets.actions';
import * as actionsEmployee from 'src/app/store/actions/employees.actions';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-fleets-create',
  templateUrl: './fleets-create.component.html',
  styles: [],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ErrorMsgComponent,
    DropdownModule,
    InputTextareaModule,
    CalendarModule,
    ButtonModule,
    InputMaskModule,
    InputTextModule,
    InputNumberModule,
  ],
})
export class FleetsCreateComponent extends BaseResourceFormComponent<Fleets.Model> implements OnInit {
  minDate!: Date;
  maxDate: Date = new Date();
  employees: Options.Dropdown[] = [];
  minDateDeparture: Date = new Date();

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    this.searchInitialKm();
    this.searchArrivalDate();
    this.searchAllEmployees();
    this.arrivalDate.disable();

    this.store
      .select('fleetsState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    this.validTime();
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsFleets.createFleets({ payload: this.toFleetsModel() }));
      } else {
        const id = this.config.data.id;
        this.store.dispatch(actionsFleets.updateFleets({ id, payload: this.toFleetsModel() }));
      }

      this.store
        .select('fleetsState')
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

  protected toFleetsModel() {
    const fleetsDTO: Fleets.Input = {
      ...this.resourceForm.value,
      initialKm: this.initialKm.value,
      arrivalDate: this.arrivalDate.value,
      employee: { id: this.employeeId.value },
    };

    return fleetsDTO;
  }

  protected onBlurDepartureDate() {
    if (this.departureDate.value) {
      this.arrivalDate.enable();
      this.minDateDeparture = this.departureDate.value;
    } else {
      this.arrivalDate.disable();
      this.minDateDeparture = new Date('2000-01-02');
    }
  }

  protected validTime() {
    if (moment(this.arrivalDate.value).isSameOrBefore(this.departureDate.value)) {
      if (this.arrivalTime.value < this.departureTime.value) {
        this.arrivalTime.setErrors({ timeValidator: true });
      } else {
        this.arrivalTime.clearValidators();
        this.arrivalTime.updateValueAndValidity();
      }
    } else if (this.arrivalTime.value) {
      this.arrivalTime.clearValidators();
      this.arrivalTime.updateValueAndValidity();
    }
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      let arrivalDate = null;
      let departureDate = null;

      if (data.arrivalDate !== null) {
        arrivalDate = zonedTimeToUtc(data.arrivalDate, getTimezone());
      }

      if (data.departureDate !== null) {
        departureDate = zonedTimeToUtc(data.departureDate, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        arrivalDate,
        departureDate,
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

  protected searchArrivalDate() {
    this.store.dispatch(actionsFleets.searchLastArrivalDate());

    this.store
      .select('fleetsState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ lastArrivalDate }) => {
        if (!moment(lastArrivalDate).isSame(new Date('2000-01-01'))) {
          if (!this.isEditing) {
            if (lastArrivalDate !== null) {
              this.minDate = zonedTimeToUtc(lastArrivalDate, getTimezone());
            }
          }
        }
      });
  }

  protected searchInitialKm() {
    this.store.dispatch(actionsFleets.searchLastKm());

    this.store
      .select('fleetsState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ lastKm }) => {
        if (lastKm > 0) {
          if (!this.isEditing) {
            this.initialKm.patchValue(lastKm);
          }
          this.initialKm.disable();
        }
      });
  }

  protected override buildResourceForm(): void {
    const initialKm = new FormControl(null, [Validators.required]);
    const departureDate = new FormControl(null, [Validators.required]);
    const arrivalDate = new FormControl([null, Validators.required, CustomValidator.validDate(departureDate)]);
    const finalKm = new FormControl(null, [Validators.required, CustomValidator.validNumber(initialKm)]);

    this.resourceForm = this.formBuilder.group({
      id: [null],
      note: [null],
      finalKm: finalKm,
      initialKm: initialKm,
      arrivalDate: arrivalDate,
      departureDate: departureDate,
      route: [null, [Validators.required]],
      arrivalTime: [null, [Validators.required, CustomValidator.timeValidator()]],
      departureTime: [null, [Validators.required, CustomValidator.timeValidator()]],

      employee: this.formBuilder.group({
        name: [],
        id: [null, [Validators.required]],
      }),
    });
  }

  get id(): FormControl {
    return this.resourceForm.get('id') as FormControl;
  }

  get route(): FormControl {
    return this.resourceForm.get('route') as FormControl;
  }

  get note(): FormControl {
    return this.resourceForm.get('note') as FormControl;
  }

  get finalKm(): FormControl {
    return this.resourceForm.get('finalKm') as FormControl;
  }

  get initialKm(): FormControl {
    return this.resourceForm.get('initialKm') as FormControl;
  }

  get departureDate(): FormControl {
    return this.resourceForm.get('departureDate') as FormControl;
  }

  get arrivalDate(): FormControl {
    return this.resourceForm.get('arrivalDate') as FormControl;
  }

  get departureTime(): FormControl {
    return this.resourceForm.get('departureTime') as FormControl;
  }

  get arrivalTime(): FormControl {
    return this.resourceForm.get('arrivalTime') as FormControl;
  }

  get employeeId(): FormControl {
    return this.resourceForm.get('employee.id') as FormControl;
  }
}
