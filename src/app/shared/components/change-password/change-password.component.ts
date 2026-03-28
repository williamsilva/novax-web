import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from 'src/app/auth';
import { wsPermissions } from 'src/app/models';
import * as store from 'src/app/store';
import * as usersActions from 'src/app/store/actions/users.actions';
import { ErrorService } from '../../error-msg';
import { ErrorMsgComponent } from '../../error-msg/error-msg.component';
import { CustomValidator } from '../../validators';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styles: [],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ErrorMsgComponent,
        InputTextModule,
        PasswordModule,
        ButtonModule,
    ],
})
export class ChangePasswordComponent {
  loading: boolean = false;
  resourceForm!: FormGroup;
  wsPermissions = wsPermissions;

  constructor(
    public auth: AuthService,
    public error: ErrorService,
    protected ref: DynamicDialogRef,
    protected formBuilder: FormBuilder,
    protected config: DynamicDialogConfig,
    protected store: Store<store.AppState>
  ) {}

  public ngOnInit(): void {
    this.buildResourceForm();

    this.resourceForm.patchValue({
      userName: this.auth.jwtPayload.sub,
      name: this.auth.jwtPayload.user_full_name,
    });
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      this.store.dispatch(usersActions.changePasswordUser({ payload: this.toModel() }));

      this.store.select('userState').subscribe(({ isLoading, success }) => {
        this.loading = isLoading;
        if (success) {
          this.reset();
        }
      });
    } else {
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  public reset(): void {
    this.ref.close();
  }

  protected buildResourceForm(): void {
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', [Validators.required, CustomValidator.matchPassword(password)]);

    this.resourceForm = this.formBuilder.group({
      name: [null],
      userName: [null],
      oldPassword: [null, [Validators.required]],

      password: password,
      confirmPassword: confirmPassword,
    });
  }

  protected toModel() {
    const productDTO: any = {
      password: this.password.value,
      id: this.auth.jwtPayload.user_id,
      oldPassword: this.oldPassword.value,
    };

    return productDTO;
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get userName(): FormControl {
    return this.resourceForm.get('userName') as FormControl;
  }

  get oldPassword(): FormControl {
    return this.resourceForm.get('oldPassword') as FormControl;
  }

  get password(): FormControl {
    return this.resourceForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.resourceForm.get('confirmPassword') as FormControl;
  }
}
