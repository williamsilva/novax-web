import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ConfigVoucher, Options, wsConsts } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as configActions from 'src/app/store/actions/config-vouchers.actions';
import { ErrorMsgComponent } from '../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-voucher-config',
  templateUrl: './voucher.component.html',
  styles: [],
  standalone: true,
  imports: [
    FormsModule,
    EditorModule,
    ButtonModule,
    ErrorMsgComponent,
    InputNumberModule,
    SelectButtonModule,
    ReactiveFormsModule,
  ],
})
export class VoucherComponent extends BaseResourceFormComponent<ConfigVoucher.Model> implements OnInit {
  stateOptions: Options.ModelBoolean[] = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.isEditing = true;
    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (this.isEditing) {
        const key = wsConsts.VOUCHER_CHANGE;
        this.store.dispatch(configActions.updateConfigVouchers({ key, payload: this.toDTO() }));
      }

      this.store
        .select('configVoucherState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ isLoading, success, config }) => {
          this.loading = isLoading;
          if (success) {
            this.resourceForm.patchValue(config);
          }
        });
    } else {
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  protected toDTO() {
    const DTO: ConfigVoucher.Input = {
      ...this.resourceForm.value,
    };

    return DTO;
  }

  protected patchValue() {
    this.store.dispatch(configActions.searchByKey({ key: wsConsts.VOUCHER_CHANGE }));
    this.store
      .select('configVoucherState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ config }) => {
        if (!this.objectIsEmpty(config)) {
          this.resourceForm.patchValue(config);
        }
      });
  }

  protected override buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      emailBody: [],
      senderMail: [],
      daysToExpire: [],
      daysToCancel: [],
      numberPendingVouchers: [],
    });
  }

  get emailBody(): FormControl {
    return this.resourceForm.get('emailBody') as FormControl;
  }

  get senderMail(): FormControl {
    return this.resourceForm.get('senderMail') as FormControl;
  }

  get daysToCancel(): FormControl {
    return this.resourceForm.get('daysToCancel') as FormControl;
  }

  get daysToExpire(): FormControl {
    return this.resourceForm.get('daysToExpire') as FormControl;
  }

  get numberPendingVouchers(): FormControl {
    return this.resourceForm.get('numberPendingVouchers') as FormControl;
  }
}
