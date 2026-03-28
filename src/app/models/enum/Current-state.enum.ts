import { KeyValueModel } from './key-value-model';

export enum CurrentStateEnum {
  Closed = 'Concluido',
  Pending = 'Pendente',
  Started = 'Iniciada',
}

export class KeyValueCurrentState extends KeyValueModel<any> {
  constructor() {
    super({
      Closed: 'CLOSED',
      Pending: 'PENDING',
      Started: 'STARTED',
    });
  }
}
