import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs';

import { Group } from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as groupActions from 'src/app/store/actions/groups.actions';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';
import { CustomValidator } from 'src/app/shared';

@Component({
  selector: 'app-groups-create',
  templateUrl: './groups-create.component.html',
  styles: [],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ErrorMsgComponent, InputTextModule, ButtonModule],
})
export class GroupsCreateComponent extends BaseResourceFormComponent<Group.Model> implements OnInit {
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
      .select('groupState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(groupActions.createGroup({ payload: this.resourceForm.value }));
      } else {
        const id = this.config.data.id;
        this.store.dispatch(groupActions.updateGroup({ id, payload: this.resourceForm.value }));
      }

      this.store
        .select('groupState')
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

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
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
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          CustomValidator.endsWithSpace(),
          CustomValidator.startsWithSpace(),
        ],
      ],
    });
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      this.resourceForm.patchValue(data);
    }
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }
}
