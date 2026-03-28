import { KeyValueModel } from './key-value-model';

export enum StatusEnum {
  Active = 'Ativo',
  Inactive = 'Inativo',
  Blocked = 'Bloqueado',
}

export class KeyValueStatus extends KeyValueModel<any> {
  constructor() {
    super({
      Active: 'ACTIVE',
      Blocked: 'BLOCKED',
      Inactive: 'INACTIVE',
    });
  }
}
