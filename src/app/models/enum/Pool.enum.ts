import { KeyValueModel } from './key-value-model';

export enum PoolEnum {
  Biribol = 'Biribol',
  Coral = 'Coral',
  Strong = 'Forte',
  Pirate = 'Pirata',
  Play = 'Play',
  Wave_Pool = 'Piscina de Ondas',
  Vulcan = 'Vulcana',
  Fall_Water_Slide = 'Queda Toboágua',
  Slow_River = 'Rio Lento',
}

export class KeyValuePool extends KeyValueModel<any> {
  constructor() {
    super({
      Play: 'PLAY',
      Coral: 'CORAL',
      Pirate: 'PIRATE',
      Vulcan: 'VULCAN',
      Biribol: 'BIRIBOL',
      Strong: 'STRONG',
      Wave_Pool: 'WAVE_POOL',
      Slow_River: 'SLOW_RIVER',
      Fall_Water_Slide: 'FALL_WATER_SLIDE',
    });
  }
}
