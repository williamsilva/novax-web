import { KeyValueModel } from './key-value-model';

export enum TypePersonEnum {
  Physical = 'Física',
  Legal = 'Jurídica',
}

export class KeyValueTypePerson extends KeyValueModel<any> {
  constructor() {
    super({
      Legal: 'LEGAL',
      Physical: 'PHYSICAL',
    });
  }
}
