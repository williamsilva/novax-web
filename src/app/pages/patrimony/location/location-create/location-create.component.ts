import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs';

import { Location, StatusEnum } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsLocation from 'src/app/store/actions/location.actions';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';
import { CustomValidator } from 'src/app/shared';

@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
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
export class LocationCreateComponent extends BaseResourceFormComponent<Location.Input> implements OnInit {
  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.store
      .select('locationState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsLocation.createLocation({ payload: this.toLocationModel() }));
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(actionsLocation.updateLocation({ uuid, payload: this.toLocationModel() }));
      }

      this.store
        .select('locationState')
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

  protected toLocationModel() {
    const voucherDTO: Location.Input = {
      ...this.resourceForm.value,
      status: this.keyValueStatusModel.getValue(this.status.value),
    };

    return voucherDTO;
  }

  protected patchValue() {
    const data = this.config.data;

    if (data) {
      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        status: this.keyValueStatusModel.getKeyByValue(data.status),
      });
    }
  }

  protected override buildResourceForm(): void {
    const status = this.getKeyByValueEnum(StatusEnum, StatusEnum.Active);

    this.resourceForm = this.formBuilder.group({
      uuid: [null],
      status: [status, Validators.required],
      description: [null, [Validators.required, CustomValidator.endsWithSpace(), CustomValidator.startsWithSpace()]],
    });
  }

  get uuid(): FormControl {
    return this.resourceForm.get('uuid') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }
}
