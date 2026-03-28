import { KeyValueModel } from './key-value-model';

export enum NotificationProfileEnum {
  User = 'Usúario',
  Manager = 'Gerente',
  Supervisor = 'Supervisor ',
}

export class KeyValueNotificationProfile extends KeyValueModel<any> {
  constructor() {
    super({
      User: 'USER',
      Manager: 'MANAGER',
      Supervisor: 'SUPERVISOR',
    });
  }
}
