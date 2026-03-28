import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs';

import { StatusEnum, CancellationReason } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsReason from 'src/app/store/actions/cancellation-reason.actions';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';
import { CustomValidator } from 'src/app/shared';

@Component({
  selector: 'app-cancellation-reason-create',
  templateUrl: './cancellation-reason-create.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ErrorMsgComponent, InputTextModule, DropdownModule, ButtonModule],
})
export class CancellationReasonCreateComponent
  extends BaseResourceFormComponent<CancellationReason.Model>
  implements OnInit
{
  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.statusEnum = this.setEnumValues(StatusEnum);

    this.store
      .select('cancellationReasonState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public override submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsReason.createReason({ payload: this.toModel() }));
      } else {
        const id = this.config.data.id;
        this.store.dispatch(actionsReason.updateReason({ id, payload: this.toModel() }));
      }

      this.store
        .select('cancellationReasonState')
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

  protected toModel() {
    const DTO: CancellationReason.Input = {
      ...this.resourceForm.value,
      status: this.keyValueStatus.getValue(this.status.value),
    };

    return DTO;
  }

  protected patchValue() {
    const data = this.config.data;

    if (data) {
      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        status: this.keyValueStatus.getKeyByValue(data.status),
      });
    }
  }

  protected override buildResourceForm(): void {
    const status = this.getKeyByValueEnum(StatusEnum, StatusEnum.Active);

    this.resourceForm = this.formBuilder.group({
      status: [status, [Validators.required]],
      name: [null, [Validators.required, CustomValidator.endsWithSpace(), CustomValidator.startsWithSpace()]],
      description: [null, [Validators.required, CustomValidator.endsWithSpace(), CustomValidator.startsWithSpace()]],
    });
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }
}
