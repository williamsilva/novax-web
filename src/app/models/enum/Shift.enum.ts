import { KeyValueModel } from './key-value-model';

export enum ShiftEnum {
  First = 'Primeiro',
  Second = 'Segundo',
  Third = 'Terceiro',
  Fourth = 'Quarto',
  Not_configured = 'Não Configurado',
}

export class KeyValueShift extends KeyValueModel<any> {
  constructor() {
    super({
      First: 'FIRST',
      Third: 'THIRD',
      Second: 'SECOND',
      Fourth: 'FOURTH',
      Not_configured: 'NOT_CONFIGURED',
    });
  }
}
