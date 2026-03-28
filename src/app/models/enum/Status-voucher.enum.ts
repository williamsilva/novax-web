import { KeyValueModel } from './key-value-model';

export enum StatusVoucherEnum {
  Exchanged = 'Acessado',
  Called_off = 'Cancelado',
  Confirmed = 'Confirmado',
  Dealing = 'Negociando',
  Not_closed = 'Não Fechado',
  Overdue = 'Vencido',
}

export class KeyValueStatusVoucher extends KeyValueModel<any> {
  constructor() {
    super({
      Dealing: 'DEALING',
      Overdue: 'OVERDUE',
      Exchanged: 'EXCHANGED',
      Confirmed: 'CONFIRMED',
      Not_closed: 'NOT_CLOSED',
      Called_off: 'CALLED_OFF',
    });
  }
}
