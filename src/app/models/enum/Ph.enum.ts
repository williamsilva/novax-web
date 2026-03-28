import { KeyValueModel } from './key-value-model';

export enum PhEnum {
  Ph_68 = '6.8',
  Ph_70 = '7.0',
  Ph_72 = '7.2',
  Ph_74 = '7.4',
  Ph_76 = '7.6',
  Ph_78 = '7.8',
}

export class KeyValuePh extends KeyValueModel<any> {
  constructor() {
    super({
      Ph_68: 'PH_68',
      Ph_70: 'PH_70',
      Ph_72: 'PH_72',
      Ph_74: 'PH_74',
      Ph_76: 'PH_76',
      Ph_78: 'PH_78',
    });
  }
}
