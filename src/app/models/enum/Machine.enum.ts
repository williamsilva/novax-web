import { KeyValueModel } from './key-value-model';

export enum MachineEnum {
  Machine_ok = 'Dentro dos Parâmetros',
  Machine_notOk = 'Fora dos Parâmetros',
  Machine_full = 'Reservatório Cheio',
}

export class KeyValueMachine extends KeyValueModel<any> {
  constructor() {
    super({
      Machine_ok: 'MACHINE_OK',
      Machine_full: 'MACHINE_FULL',
      Machine_notOk: 'MACHINE_NOT_OK',
    });
  }
}
