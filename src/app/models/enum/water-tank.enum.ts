import { KeyValueModel } from './key-value-model';

export enum WaterTankEnum {
  Full = 'Cheia',
  Half = 'Metade',
  Empty = 'Vazia',
}

export class KeyValueWaterTank extends KeyValueModel<any> {
  constructor() {
    super({
      Full: 'FULL',
      Half: 'HALF',
      Empty: 'EMPTY',
    });
  }
}
