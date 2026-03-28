import { KeyValueModel } from './key-value-model';

export enum StatusMaintenanceScheduleEnum {
  Scheduled = 'Agendada',
  Won = 'Vencida',
}

export class KeyValueStatusMaintenanceSchedule extends KeyValueModel<any> {
  constructor() {
    super({
      Scheduled: 'SCHEDULED',
      Won: 'WON',
    });
  }
}
