import { KeyValueModel } from './key-value-model';

export enum ChlorineEnum {
  Chlorine_00 = '0',
  Chlorine_05 = '0.5',
  Chlorine_10 = '1.0',
  Chlorine_15 = '1.5',
  Chlorine_20 = '2.0',
  Chlorine_25 = '2.5',
  Chlorine_30 = '3.0',
  Chlorine_35 = '3.5',
  Chlorine_40 = '4.0',
  Chlorine_45 = '4.5',
  Chlorine_50 = '5.0',
}

export class KeyValueChlorine extends KeyValueModel<any> {
  constructor() {
    super({
      Chlorine_00: 'CHLORINE_00',
      Chlorine_05: 'CHLORINE_05',
      Chlorine_10: 'CHLORINE_10',
      Chlorine_15: 'CHLORINE_15',
      Chlorine_20: 'CHLORINE_20',
      Chlorine_25: 'CHLORINE_25',
      Chlorine_30: 'CHLORINE_30',
      Chlorine_35: 'CHLORINE_35',
      Chlorine_40: 'CHLORINE_40',
      Chlorine_45: 'CHLORINE_45',
      Chlorine_50: 'CHLORINE_50',
    });
  }
}
