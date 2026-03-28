import { KeyValueModel } from './key-value-model';

export enum TypeProductEnum {
  Food = 'Alimentação',
  Ticket = 'Ingressos',
  Courtesy = 'Cortesia',
}

export class KeyValueTypeProduct extends KeyValueModel<any> {
  constructor() {
    super({
      Food: 'FOOD',
      Ticket: 'TICKET',
      Courtesy: 'COURTESY',
    });
  }
}
