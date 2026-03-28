import { KeyValueModel } from './key-value-model';

export enum FrequencyMaintenanceEnum {
  Weekly = 'Semanal',
  Biweekly = 'Quinzenal',
  Monthly = 'Mensal ',
  Quarterly = 'Trimestral',
  Semi_annual = 'Semestral',
  Yearly = 'Anual',
}

export class KeyValueFrequencyMaintenance extends KeyValueModel<any> {
  constructor() {
    super({
      Yearly: 'YEARLY',
      Weekly: 'WEEKLY',
      Monthly: 'MONTHLY',
      Biweekly: 'BIWEEKLY',
      Quarterly: 'QUARTERLY',
      Semi_annual: 'SEMI_ANNUAL',
    });
  }
}
