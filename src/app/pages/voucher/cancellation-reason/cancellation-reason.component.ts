import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';

import { CancellationReason, StatusEnum, StatusVoucherEnum, Voucher, wsConsts } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as actionsVouchersCancellationReason from 'src/app/store/actions/cancellation-reason.actions';
import * as actionsVouchers from 'src/app/store/actions/vouchers.actions';
import { ErrorMsgComponent } from '../../../shared/error-msg/error-msg.component';
import { VoucherCreateComponent } from '../voucher-create';

@Component({
  selector: 'app-cancellation-reason',
  templateUrl: './cancellation-reason.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [FormsModule, ButtonModule, DropdownModule, ErrorMsgComponent, ReactiveFormsModule],
})
export class CancellationReasonComponent extends BaseResourceFormComponent<CancellationReason.Model> implements OnInit {
  reasons: {
    value: number;
    label: string;
    inactive: boolean;
  }[] = [];

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
    protected voucherCreateComponent: VoucherCreateComponent,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllReasons();
  }

  public override reset(): void {
    this.ref.close();
  }

  public override submitForm(): void {
    const data = this.config.data;
    if (data) {
      const uuid = data;

      const payload = this.toCancellationModel();

      if (this.resourceForm.valid) {
        this.store.dispatch(actionsVouchers.cancelVoucher({ uuid, payload }));

        this.store
          .select('voucherState')
          .pipe(takeUntil(this.destroy$))
          .subscribe(({ canceled, isLoading }) => {
            this.loading = isLoading;
            if (canceled) {
              this.voucherCreateComponent.setStatusVouchers(StatusVoucherEnum.Called_off);
              this.reset();
            }
          });
      } else {
        this.error.checkFormValidations(this.resourceForm);
      }
    }
  }

  protected searchAllReasons() {
    this.store.dispatch(actionsVouchersCancellationReason.searchAllReason());

    this.store
      .select('cancellationReasonState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ reasons }) => {
        if (!this.objectIsEmpty(reasons)) {
          let data = reasons.sort((a: CancellationReason.Model, b: CancellationReason.Model) => {
            return a.name < b.name ? -1 : 1;
          });

          data = data.filter((p: CancellationReason.Model) => p.name != wsConsts.SYSTEM);

          this.reasons = data.map((m: CancellationReason.Model) => ({
            value: m.id,
            label: m.name,
            inactive: m.status === this.getValueKeyStatusByEnum(StatusEnum.Active) ? false : true,
          }));
        }
      });
  }

  protected toCancellationModel() {
    const DTO: Voucher.CancellationInput = {
      ...this.resourceForm.value,
      cancellationReason: { id: this.cancellationReasonId.value },
    };
    return DTO;
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      cancellationReason: this.formBuilder.group({
        name: [],
        id: [null, [Validators.required]],
      }),
    });
  }

  get cancellationReasonId(): FormControl {
    return this.resourceForm.get('cancellationReason.id') as FormControl;
  }
}
