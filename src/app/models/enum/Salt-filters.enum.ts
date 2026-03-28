import { KeyValueModel } from './key-value-model';

export enum SaltFiltersEnum {
  In_good_conditions = 'Em bom estado',
  Dirty = 'Sujo',
}

export class KeyValueSaltFilters extends KeyValueModel<any> {
  constructor() {
    super({
      Dirty: 'DIRTY',
      In_good_conditions: 'IN_GOOD_CONDITIONS',
    });
  }
}
