import { KeyValueModel } from './key-value-model';

export enum SexEnum {
  M = 'Masculino',
  F = 'Feninino',
}

export class KeyValueSex extends KeyValueModel<any> {
  constructor() {
    super({
      M: 'M',
      F: 'F',
    });
  }
}
