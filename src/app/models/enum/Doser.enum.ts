import { KeyValueModel } from './key-value-model';

export enum DoserEnum {
  Doser_10 = '10%',
  Doser_20 = '20%',
  Doser_30 = '30%',
  Doser_40 = '40%',
  Doser_50 = '50%',
  Doser_60 = '60%',
  Doser_70 = '70%',
  Doser_80 = '80%',
  Doser_90 = '90%',
  Doser_100 = '100%',
}

export class KeyValueDoser extends KeyValueModel<any> {
  constructor() {
    super({
      Doser_10: 'DOSER_10',
      Doser_20: 'DOSER_20',
      Doser_30: 'DOSER_30',
      Doser_40: 'DOSER_40',
      Doser_50: 'DOSER_50',
      Doser_60: 'DOSER_60',
      Doser_70: 'DOSER_70',
      Doser_80: 'DOSER_80',
      Doser_90: 'DOSER_90',
      Doser_100: 'DOSER_100',
    });
  }
}
