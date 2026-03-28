import { KeyValueModel } from './key-value-model';

export enum FlowMeterEnum {
  Meter = 'Reservatório Cheio',
  Meter_80 = '80',
  Meter_90 = '90',
  Meter_100 = '100',
  Meter_110 = '110',
  Meter_120 = '120',
  Meter_130 = '130',
  Meter_140 = '140',
  Meter_150 = '150',
  Meter_160 = '160',
  Meter_170 = '170',
  Meter_180 = '180',
  Meter_190 = '190',
  Meter_200 = '200',
}

export class KeyValueFlowMeter extends KeyValueModel<any> {
  constructor() {
    super({
      Meter: 'METER',
      Meter_80: 'METER_80',
      Meter_90: 'METER_90',
      Meter_100: 'METER_100',
      Meter_110: 'METER_110',
      Meter_120: 'METER_120',
      Meter_130: 'METER_130',
      Meter_140: 'METER_140',
      Meter_150: 'METER_150',
      Meter_160: 'METER_160',
      Meter_170: 'METER_170',
      Meter_180: 'METER_180',
      Meter_190: 'METER_190',
      Meter_200: 'METER_200',
    });
  }
}
