import { Component, Injector } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskDirective } from 'ngx-mask';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ErrorMsgComponent } from '../../error-msg/error-msg.component';
import { MaskTelephonePipe } from '../../mask-telephone.pipe';
import { MasterBaseDetailComponent } from '../base-resource-form/master-base-detail-component';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styles: [],
    standalone: true,
    imports: [
        ButtonModule,
        TableModule,
        SharedModule,
        TooltipModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        ErrorMsgComponent,
        InputTextModule,
        NgxMaskDirective,
        MaskTelephonePipe,
    ],
})
export class ContactsComponent extends MasterBaseDetailComponent<any> {
  maskCellphone: string = '(00) 0000-0000';
  maskTelephone: string = '(00) 0000-0000';

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public onChangeMaskCellphone() {
    const cellphone = this.cellphone.value;
    if (cellphone) {
      this.maskCellphone = cellphone.length === 9 ? '(00) 0000-0000' : '(00) 0 0000-0000';
    }
  }

  public onChangeMaskTelephone() {
    const telephone = this.telephone.value;
    if (telephone) {
      this.maskTelephone = telephone.length === 9 ? '(00) 0000-0000' : '(00) 0 0000-0000';
    }
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      telephone: [null],
      cellphone: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required, Validators.maxLength(50)]],
    });
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get email(): FormControl {
    return this.resourceForm.get('email') as FormControl;
  }

  get cellphone(): FormControl {
    return this.resourceForm.get('cellphone') as FormControl;
  }

  get telephone(): FormControl {
    return this.resourceForm.get('telephone') as FormControl;
  }
}
