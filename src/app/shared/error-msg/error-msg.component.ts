import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ErrorService } from './error.service';

@Component({
    selector: 'app-error-msg',
    template: `<label for="float-input" [style.color]="hasErrorMessage ? 'red' : 'black'">{{ errorMessage }}</label>`,
    styleUrls: [],
    standalone: true,
})
export class ErrorMsgComponent implements OnInit {
  @Input() hidden = false;
  @Input() label!: string;
  @Input() required = true;
  @Input() control!: FormControl;

  controlError!: any;

  constructor(public error: ErrorService) {}

  ngOnInit() {}

  get hasErrorMessage() {
    return (this.controlError = this.error.hasErrors(this.control, this.label));
  }

  get errorMessage() {
    if (this.controlError) {
      return this.error.hasErrors(this.control, this.label);
    }

    if (this.controlError === null && !this.hidden && this.required) {
      return `* ${this.label}`;
    }

    if (this.controlError === null && !this.hidden && !this.required) {
      return this.label;
    }
  }
}
