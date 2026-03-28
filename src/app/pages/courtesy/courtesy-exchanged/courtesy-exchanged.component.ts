import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ErrorMsgComponent, MaskDocumentPipe } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import { Courtesy, Employee, StatusEnum, Options } from 'src/app/models';
import * as actionsCourtesy from 'src/app/store/actions/courtesy.actions';
import * as actionsEmployee from 'src/app/store/actions/employees.actions';

@Component({
  selector: 'app-courtesy-exchanged',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ErrorMsgComponent,
    DropdownModule,
    AutoCompleteModule,
    TableModule,
    DatePipe,
    MaskDocumentPipe,
  ],
  templateUrl: './courtesy-exchanged.component.html',
  styles: ``,
})
export class CourtesyExchangedComponent extends BaseResourceFormComponent<Courtesy.ReplacementInput> implements OnInit {
  resources: Courtesy.Model[] = [];
  employees: Options.Dropdown[] = [];
  suggestions: Options.Dropdown[] = [];

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    this.buildResourceForm();

    this.resources = this.config.data;

    this.searchAllEmployees();
    this.removedBy?.valueChanges.subscribe((value) => {
      this.filterCountry({ query: value });
    });
  }

  public submitForm() {
    if (this.resourceForm.valid && this.resources.length > 0) {
      if (this.resources) {
        const uuids: string[] = [];
        this.resources.forEach((courtesy: Courtesy.Model) => {
          uuids.push(courtesy.uuid);
        });

        const inputDTO: Courtesy.ReplacementInput = {
          ...this.resourceForm.value,
          courtesyIds: uuids,
          removedBy: {
            id: this.removedBy.value.id,
          },
        };
        this.store.dispatch(actionsCourtesy.replacementMultipleCourtesy({ payload: inputDTO }));

        this.store
          .select('courtesyState')
          .pipe(takeUntil(this.destroy$))
          .subscribe(({ exchanged }) => {
            if (exchanged) {
              this.reset();
            }
          });
      }
    } else {
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  public filterCountry(event: any) {
    if (typeof event.query === 'string') {
      this.suggestions = this.employees.filter((e) => e.name.toLowerCase().includes(event.query.toLowerCase()));
    }
  }

  public override reset(): void {
    this.ref.close();
  }

  public deleteResource(courtesy: Courtesy.Model) {
    this.resources = this.resources.filter((item) => !courtesy.uuid.includes(item.uuid));
  }

  protected searchAllEmployees() {
    this.store.dispatch(actionsEmployee.searchEmployees());

    this.store
      .select('employeeState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ employee }) => {
        if (!this.objectIsEmpty(employee)) {
          const activeEmployees = employee.filter(
            (e: Employee.Model) => e.statusEmployee === this.getValueKeyStatusByEnum(StatusEnum.Active),
          );

          const attendant = activeEmployees.filter((e: Employee.Model) => e.isAttendant === true);

          const data = attendant.sort((a: Employee.Model, b: Employee.Model) => {
            return a.name < b.name ? -1 : 1;
          });

          this.employees = data.map((m: Employee.Model) => ({
            id: m.id,
            name: m.name,
            inactive: m.statusEmployee === this.getValueKeyStatusByEnum(StatusEnum.Active) ? false : true,
          }));
        }
      });
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      removedBy: [null, [Validators.required]],
      actualVisitDate: [new Date(), [Validators.required]],
    });
  }

  get actualVisitDate(): FormControl {
    return this.resourceForm.get('actualVisitDate') as FormControl;
  }

  get removedBy(): FormControl {
    return this.resourceForm.get('removedBy') as FormControl;
  }
}
