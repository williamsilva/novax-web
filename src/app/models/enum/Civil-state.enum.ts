import { KeyValueModel } from './key-value-model';

export enum CivilStateEnum {
  Single = 'Solteiro(a)',
  Married = 'Casado(a)',
  Widower = 'Viúvo(a)',
  Divorced = 'Divorciado(a)',
}

export class KeyValueCivilState extends KeyValueModel<any> {
  constructor() {
    super({
      Single: 'SINGLE',
      Married: 'MARRIED',
      Widower: 'WIDOWER',
      Divorced: 'DIVORCED',
    });
  }
}
