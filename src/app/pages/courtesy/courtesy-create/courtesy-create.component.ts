import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ErrorMsgComponent, getTimezone } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsCourtesy from 'src/app/store/actions/courtesy.actions';
import * as actionsEmployee from 'src/app/store/actions/employees.actions';
import {
  Courtesy,
  Employee,
  KeyValueStatusCourtesy,
  Options,
  StatusCourtesyEnum,
  StatusEnum,
  wsConsts,
} from 'src/app/models';
import { zonedTimeToUtc } from 'date-fns-tz';

@Component({
  selector: 'app-courtesy-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ErrorMsgComponent,
    ButtonModule,
    InputTextModule,
    NgxMaskDirective,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
  ],
  templateUrl: './courtesy-create.component.html',
  styles: ``,
})
export class CourtesyCreateComponent extends BaseResourceFormComponent<Courtesy.Input> implements OnInit {
  mask: string = wsConsts.MASK_CPF;
  managers: Options.Dropdown[] = [];
  suggestions: Options.Dropdown[] = [];
  statusCourtesy: Options.TypeEnum[] = [];
  keyValueStatusCourtesy = new KeyValueStatusCourtesy();

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    this.statusCourtesy = this.setEnumValues(StatusCourtesyEnum);
    this.searchAllManagers();
    this.authorizedBy?.valueChanges.subscribe((value) => {
      this.filterCountry({ query: value });
    });

    this.store
      .select('courtesyState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public filterCountry(event: any) {
    if (typeof event.query === 'string') {
      this.suggestions = this.managers.filter((e) => e.name.toLowerCase().includes(event.query.toLowerCase()));
    }
  }

  public override submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsCourtesy.createCourtesy({ payload: this.toCourtesyModel() }));
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(actionsCourtesy.updateCourtesy({ uuid, payload: this.toCourtesyModel() }));
      }

      this.store
        .select('courtesyState')
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

  protected toCourtesyModel() {
    const courtesyDTO: Courtesy.Input = {
      ...this.resourceForm.value,

      status: this.keyValueStatusCourtesy.getValue(this.status.value),
      authorizedBy: {
        id: this.authorizedBy.value.id,
      },
    };

    return courtesyDTO;
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      let scheduledVisitDate = null;

      if (data.visitDate !== null) {
        scheduledVisitDate = zonedTimeToUtc(data.scheduledVisitDate, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        scheduledVisitDate,
        status: this.keyValueStatusCourtesy.getKeyByValue(data.status),
      });
    }
  }

  protected searchAllManagers() {
    this.store.dispatch(actionsEmployee.searchEmployees());

    this.store
      .select('employeeState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ employee }) => {
        if (!this.objectIsEmpty(employee)) {
          const activeEmployees = employee.filter(
            (e: Employee.Model) => e.statusEmployee === this.getValueKeyStatusByEnum(StatusEnum.Active),
          );

          const manages = activeEmployees.filter((e: Employee.Model) => e.isManager === true);

          const data = manages.sort((a: Employee.Model, b: Employee.Model) => {
            return a.name < b.name ? -1 : 1;
          });

          this.managers = data.map((m: Employee.Model) => ({
            id: m.id,
            name: m.name,
            inactive: m.statusEmployee === this.getValueKeyStatusByEnum(StatusEnum.Active) ? false : true,
          }));
        }
      });
  }

  protected override buildResourceForm(): void {
    const status = this.getKeyByValueEnum(StatusCourtesyEnum, StatusCourtesyEnum.Pending);

    this.resourceForm = this.formBuilder.group({
      status: [status],
      document: [null],
      client: [null, [Validators.required]],
      authorizedBy: [null, [Validators.required]],
      scheduledVisitDate: [null, [Validators.required]],
    });
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get client(): FormControl {
    return this.resourceForm.get('client') as FormControl;
  }

  get document(): FormControl {
    return this.resourceForm.get('document') as FormControl;
  }

  get authorizedBy(): FormControl {
    return this.resourceForm.get('authorizedBy') as FormControl;
  }

  get scheduledVisitDate(): FormControl {
    return this.resourceForm.get('document') as FormControl;
  }
}
