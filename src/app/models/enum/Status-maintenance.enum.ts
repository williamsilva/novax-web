import { KeyValueModel } from './key-value-model';

export enum StatusMaintenanceEnum {
  Budget = 'Orçando',
  Proposal = 'Proposta',
  Approved = 'Aprovado',
  Concerted = 'Concertado',
  Received = 'Recebido',
}

export class KeyValueStatusMaintenance extends KeyValueModel<any> {
  constructor() {
    super({
      Budget: 'BUDGET',
      Proposal: 'PROPOSAL',
      Approved: 'APPROVED',
      Received: 'RECEIVED',
      Concerted: 'CONCERTED',
    });
  }
}
