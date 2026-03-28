import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { takeUntil } from 'rxjs';

import { ConfigEmail, wsConsts } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as configActions from 'src/app/store/actions/config-vouchers.actions';

@Component({
  selector: 'app-email-config',
  templateUrl: './email.component.html',
  styles: [],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule],
})
export class EmailComponent extends BaseResourceFormComponent<ConfigEmail.Model> implements OnInit {
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
    const DTO: ConfigEmail.Input = {
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
    });
  }

  get emailBody(): FormControl {
    return this.resourceForm.get('emailBody') as FormControl;
  }
}
