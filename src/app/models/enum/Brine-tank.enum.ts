import { KeyValueModel } from './key-value-model';

export enum BrineTankEnum {
  Brine_200 = '200 Litros',
  Brine_400 = '400 Litros',
  Brine_500 = '500 Litros',
  Brine_600 = '600 Litros',
  Brine_700 = '700 Litros',
  Brine_800 = '800 Litros',
  Brine_900 = '900 Litros',
  Brine_1000 = '1000 Litros',
}

export class KeyValueBrineTank extends KeyValueModel<any> {
  constructor() {
    super({
      Brine_200: 'BRINE_200',
      Brine_400: 'BRINE_400',
      Brine_500: 'BRINE_500',
      Brine_600: 'BRINE_600',
      Brine_700: 'BRINE_700',
      Brine_800: 'BRINE_800',
      Brine_900: 'BRINE_900',
      Brine_1000: 'BRINE_1000',
    });
  }
}
