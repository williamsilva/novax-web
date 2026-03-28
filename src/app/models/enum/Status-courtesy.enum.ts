import { KeyValueModel } from './key-value-model';

export enum StatusCourtesyEnum {
  Pending = 'Pendente',
  Exchanged = 'Acessado',
  Expired = 'Vencido',
  Canceled = 'Cancelado',
}

export class KeyValueStatusCourtesy extends KeyValueModel<any> {
  constructor() {
    super({
      Pending: 'PENDING',
      Exchanged: 'EXCHANGED',
      Expired: 'EXPIRED',
      Canceled: 'CANCELED',
    });
  }
}
