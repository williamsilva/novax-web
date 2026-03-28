import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import * as moment from 'moment';

export class CustomValidator {
  static endsWithSpace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value && typeof value === 'string' && value.slice(-1) === ' ') {
        return { endsWithSpace: true };
      }
      return null;
    };
  }

  static timeValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      // Hora no formato "20:00" ou "20:00:00"
      let value = control.value;

      // Verificar se a hora está no formato "HH:MM:SS"
      let regexTimeSecunds = /^\d{2}:\d{2}:\d{2}$/;

      if (!regexTimeSecunds.test(value)) {
        // Adicionar segundos apenas se não estiverem presentes
        value += ':00';
      }

      if (value) {
        const horaRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/;

        if (!horaRegex.test(value)) {
          return { timeValidator: true };
        }
      }

      return null;
    };
  };

  static startsWithSpace = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value && typeof value === 'string' && value.charAt(0) === ' ') {
        return { startsWithSpace: true };
      }
      return null;
    };
  };

  static matchPassword = (equalControl: AbstractControl): ValidatorFn => {
    let subscribe = false;

    return (control: AbstractControl): any => {
      if (!subscribe) {
        subscribe = true;
        equalControl.valueChanges.subscribe(() => {
          control.updateValueAndValidity();
        });
      }
      const v: string = control.value;
      return equalControl.value === v ? null : { matchPassword: { control: equalControl, value: equalControl.value } };
    };
  };

  static validDate = (equalControl: AbstractControl): ValidatorFn => {
    let subscribe = false;

    return (control: AbstractControl): any => {
      if (!subscribe) {
        subscribe = true;
        equalControl.valueChanges.subscribe(() => {
          control.updateValueAndValidity();
        });
      }

      const first: string = control.value;
      const last: string = equalControl.value;

      if (last === null) {
        return null;
      }

      if (moment(last).isAfter(first)) {
        return { invalidDate: { control: equalControl, value: last } };
      }

      return null;
    };
  };

  static validNumber = (equalControl: AbstractControl): ValidatorFn => {
    let subscribe = false;

    return (control: AbstractControl): any => {
      if (!subscribe) {
        subscribe = true;
        equalControl.valueChanges.subscribe(() => {
          control.updateValueAndValidity();
        });
      }

      const first: number = control.value;
      const last: number = equalControl.value;

      if (last === null) {
        return null;
      }

      if (first < last) {
        return { invalidNumber: { control: equalControl, value: last } };
      }

      return null;
    };
  };

  static isValidCnpj = (): ValidatorFn => {
    return (control: AbstractControl): any => {
      let document = control.value;

      if (document) {
        document = document.replace(/[^\d]+/g, '');

        if (document.length < 14) {
          return { cnpjNotValid: false };
        }

        // Elimina CNPJs invalidos conhecidos
        if (
          document == '00000000000000' ||
          document == '11111111111111' ||
          document == '22222222222222' ||
          document == '33333333333333' ||
          document == '44444444444444' ||
          document == '55555555555555' ||
          document == '66666666666666' ||
          document == '77777777777777' ||
          document == '88888888888888' ||
          document == '99999999999999'
        ) {
          return { cnpjNotValid: true };
        }

        // Valida DVs
        let size = document.length - 2;
        const digits = document.substring(size);
        let numbers = document.substring(0, size);

        let soma = 0;
        let pos = size - 7;

        for (let i = size; i >= 1; i--) {
          soma += numbers.charAt(size - i) * pos--;
          if (pos < 2) pos = 9;
        }

        let result = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (result != digits.charAt(0)) return { cnpjNotValid: true };

        size = size + 1;
        numbers = document.substring(0, size);
        soma = 0;
        pos = size - 7;

        for (let i = size; i >= 1; i--) {
          soma += numbers.charAt(size - i) * pos--;
          if (pos < 2) pos = 9;
        }

        result = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (result != digits.charAt(1)) return { cnpjNotValid: true };

        return null;
      }
    };
  };

  /**
   * Valida se o CPF é valido. Deve-se ser informado o cpf sem máscara.
   */
  static isValidCpf = (): ValidatorFn => {
    return (control: AbstractControl): any => {
      const document = control.value;
      if (document) {
        let numbers, digits, sum, i, result, equalDigits;
        equalDigits = 1;

        if (document.length < 11) {
          return { cpfNotValid: false };
        }

        for (i = 0; i < document.length - 1; i++) {
          if (document.charAt(i) !== document.charAt(i + 1)) {
            equalDigits = 0;
            break;
          }
        }

        if (!equalDigits) {
          numbers = document.substring(0, 9);
          digits = document.substring(9);
          sum = 0;
          for (i = 10; i > 1; i--) {
            sum += numbers.charAt(10 - i) * i;
          }

          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          if (result !== Number(digits.charAt(0))) {
            return { cpfNotValid: true };
          }
          numbers = document.substring(0, 10);
          sum = 0;

          for (i = 11; i > 1; i--) {
            sum += numbers.charAt(11 - i) * i;
          }
          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          if (result !== Number(digits.charAt(1))) {
            return { cpfNotValid: true };
          }
          return null;
        } else {
          return { cpfNotValid: true };
        }
      }
      return null;
    };
  };
}
