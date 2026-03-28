import { KeyValueModel } from './key-value-model';

export enum TypeAgentEnum {
  Client = 'Cliente',
  Promoter = 'Promotor',
  Provider = 'Fornecedor',
  Employee = 'Funcionário',
  Tour_Guide = 'Guia Turístico'
}

export class KeyValueTypeAgent extends KeyValueModel<any> {
  constructor() {
    super({
      Client: 'CLIENT',
      Promoter: 'PROMOTER',
      Provider: 'PROVIDER',
      Employee: 'EMPLOYEE',
      Tour_Guide: 'TOUR_GUIDE'
    });
  }
}
