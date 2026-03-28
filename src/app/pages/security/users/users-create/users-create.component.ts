import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { zonedTimeToUtc } from 'date-fns-tz';
import { NgxMaskDirective } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs';

import { StatusEnum, User, wsConsts } from 'src/app/models';
import { CustomValidator, getTimezone } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as usersActions from 'src/app/store/actions/users.actions';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    NgxMaskDirective,
    ErrorMsgComponent,
    ReactiveFormsModule,
  ],
})
export class UsersCreateComponent extends BaseResourceFormComponent<User.Model> implements OnInit {
  wsConsts = wsConsts;

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
      .select('userState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(usersActions.createUser({ payload: this.toUserModel() }));
      } else {
        const id = this.config.data.id;
        this.store.dispatch(usersActions.updateUser({ id, payload: this.toUserModel() }));
      }

      this.store
        .select('userState')
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

  public searchExistDocument() {
    if (this.document.valid) {
      if (!this.isEditing) {
        this.store.dispatch(usersActions.notUniqueUserSuccess({ notUnique: false }));
        this.store.dispatch(usersActions.notUniqueUser({ payload: this.document.value }));
        this.store
          .select('userState')
          .pipe(takeUntil(this.destroy$))
          .subscribe(({ notUnique }) => {
            if (notUnique) {
              this.document.setErrors({ notUnique: true });
            }
          });
      }
    }
  }

  protected toUserModel() {
    const userDTO: User.Input = {
      ...this.resourceForm.value,
      status: this.keyValueStatusModel.getValue(this.status.value),
    };

    return userDTO;
  }

  protected buildResourceForm(): void {
    const status = this.getKeyByValueEnum(StatusEnum, StatusEnum.Active);

    this.resourceForm = this.formBuilder.group({
      status: [status, Validators.required],
      birthDate: [null, Validators.required],
      document: [null, [Validators.required, CustomValidator.isValidCpf()]],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          CustomValidator.endsWithSpace(),
          CustomValidator.startsWithSpace(),
        ],
      ],
      email: [null, [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
    });
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      let birthDate = null;

      if (data.birthDate !== null) {
        birthDate = zonedTimeToUtc(data.birthDate, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        birthDate,
        status: this.keyValueStatusModel.getKeyByValue(data.status),
      });
    }
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get email(): FormControl {
    return this.resourceForm.get('email') as FormControl;
  }

  get document(): FormControl {
    return this.resourceForm.get('document') as FormControl;
  }

  get birthDate(): FormControl {
    return this.resourceForm.get('birthDate') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }
}
