import { KeyValueModel } from './key-value-model';

export enum SectorEnum {
  Civil = 'Civil',
  Cleaning = 'Limpeza',
  Electric = 'Elétrica',
  Mechanics = 'Mecânica',
  Maintenance = 'Manutenção',
}

export class KeyValueSector extends KeyValueModel<any> {
  constructor() {
    super({
      Civil: 'CIVIL',
      Cleaning: 'CLEANING',
      Electric: 'ELECTRIC',
      Mechanics: 'MECHANICS',
      Maintenance: 'MAINTENANCE',
    });
  }
}
