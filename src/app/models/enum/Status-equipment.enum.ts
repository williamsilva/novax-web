import { KeyValueModel } from './key-value-model';

export enum StatusEquipmentEnum {
  Active = 'Ativo',
  Burned = 'Queimado',
  Maintenance = 'Manutenção',
  Discarded = 'Descartado',
}

export class KeyValueEquipment extends KeyValueModel<any> {
  constructor() {
    super({
      Active: 'ACTIVE',
      Burned: 'BURNED',
      Discarded: 'DISCARDED',
      Maintenance: 'MAINTENANCE',
    });
  }
}
