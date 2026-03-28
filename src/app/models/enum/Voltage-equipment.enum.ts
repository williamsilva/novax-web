import { KeyValueModel } from './key-value-model';

export enum VoltageEquipmentEnum {
  Diesel = 'Diesel',
  Gasoline = 'Gasolina',
  Bivolt = 'Bivolt',
  Single_Phase_127 = '127 Mono Fásica',
  Single_Phase_220 = '220 Mono Fásica',
  Bi_Phase_220 = '220 Bi Fásica',
  Bi_Phase_380 = '380 Bi Fásica',
  Three_Phase_220 = '220 Tri Fásica',
  Three_Phase_380 = '380 Tri Fásica',
}

export class KeyValueStatusVoltage extends KeyValueModel<any> {
  constructor() {
    super({
      Bivolt: 'BIVOLT',
      Diesel: 'DIESEL',
      Gasoline: 'GASOLINE',
      Bi_Phase_220: 'BI_PHASE_220',
      Bi_Phase_380: 'BI_PHASE_380',
      Three_Phase_380: 'THREE_PHASE_380',
      Three_Phase_220: 'THREE_PHASE_220',
      Single_Phase_127: 'SINGLE_PHASE_127',
      Single_Phase_220: 'SINGLE_PHASE_220',
    });
  }
}
