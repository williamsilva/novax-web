import { KeyValueModel } from './key-value-model';

export enum AlkalinityEnum {
  Alkalinity_10 = '10',
  Alkalinity_20 = '20',
  Alkalinity_30 = '30',
  Alkalinity_40 = '40',
  Alkalinity_50 = '50',
  Alkalinity_60 = '60',
  Alkalinity_70 = '70',
  Alkalinity_80 = '80',
  Alkalinity_90 = '90',
  Alkalinity_100 = '100',
}

export class KeyValueAlkalinity extends KeyValueModel<any> {
  constructor() {
    super({
      Alkalinity_10: 'ALKALINITY_10',
      Alkalinity_20: 'ALKALINITY_20',
      Alkalinity_30: 'ALKALINITY_30',
      Alkalinity_40: 'ALKALINITY_40',
      Alkalinity_50: 'ALKALINITY_50',
      Alkalinity_60: 'ALKALINITY_60',
      Alkalinity_70: 'ALKALINITY_70',
      Alkalinity_80: 'ALKALINITY_80',
      Alkalinity_90: 'ALKALINITY_90',
      Alkalinity_100: 'ALKALINITY_100',
    });
  }
}
