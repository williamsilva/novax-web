import { KeyValueModel } from './key-value-model';

export enum StatusHistoricEnum {
  Active = 'Ativo',
  Removed = 'Removido',
  Discarded = 'Discartado',
  Maintenance = 'Manutenção',
}

export class KeyValueHistoric extends KeyValueModel<any> {
  constructor() {
    super({
      Active: 'ACTIVE',
      Removed: 'REMOVED',
      Discarded: 'DISCARDED',
      Maintenance: 'MAINTENANCE',
    });
  }
}
