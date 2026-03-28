import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { MassageValidations } from '../validators';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  controlError!: any;

  constructor() {}

  hasErrors(control: any, label: string) {
    for (const propertyName in control.errors) {
      if (control.errors.hasOwnProperty(propertyName) && control.touched) {
        return MassageValidations.getErrorMsg(label, propertyName, control.errors[propertyName]);
      }
    }
    return null;
  }

  hasErrorsMsg(control: any, label: string, required = true) {
    for (const propertyName in control.errors) {
      if (control.errors.hasOwnProperty(propertyName) && control.touched) {
        return MassageValidations.getErrorMsg(label, propertyName, control.errors[propertyName]);
      }
    }

    if (required) {
      return `${label}*`;
    } else {
      return label;
    }
  }

  hasControlErrors(control: any) {
    for (const propertyName in control.errors) {
      if (control.errors.hasOwnProperty(propertyName) && control.touched) {
        return true;
      }
    }
    return false;
  }

  checkFormValidations(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field) as FormControl;
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.checkFormValidations(control);
      }
    });
  }

  hasClassError(control: any) {
    if (this.hasControlErrors(control)) {
      return 'red';
    }
    return '';
  }
}
