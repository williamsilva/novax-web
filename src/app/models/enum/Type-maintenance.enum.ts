import { KeyValueModel } from './key-value-model';

export enum TypeMaintenanceEnum {
  Detective = 'Detectiva',
  Predictive = 'Preditiva',
  Preventative = 'Preventiva',
  Urgent_correction = 'Corretiva Urgente',
  Scheduled_correction = 'Corretiva Programada',
}

export class KeyValueTypeMaintenance extends KeyValueModel<any> {
  constructor() {
    super({
      Detective: 'DETECTIVE',
      Predictive: 'PREDICTIVE',
      Preventative: 'PREVENTATIVE',
      Urgent_correction: 'URGENT_CORRECTION',
      Scheduled_correction: 'SCHEDULED_CORRECTION',
    });
  }
}

// https://www.imcresistencias.com.br/post/conheca-os-5-principais-tipos-de-manutencao-em-uma-industria
