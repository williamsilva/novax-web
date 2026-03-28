import {
  PhEnum,
  PoolEnum,
  ShiftEnum,
  StatusEnum,
  KeyValuePh,
  KeyValuePool,
  ChlorineEnum,
  KeyValueShift,
  WaterTankEnum,
  BrineTankEnum,
  AlkalinityEnum,
  KeyValueStatus,
  TypePersonEnum,
  KeyValueHistoric,
  KeyValueChlorine,
  KeyValueEquipment,
  KeyValueWaterTank,
  StatusVoucherEnum,
  KeyValueBrineTank,
  KeyValueTypePerson,
  KeyValueAlkalinity,
  StatusHistoricEnum,
  StatusEquipmentEnum,
  TypeMaintenanceEnum,
  StatusMaintenanceEnum,
  KeyValueStatusVoucher,
  KeyValueTypeMaintenance,
  NotificationProfileEnum,
  FrequencyMaintenanceEnum,
  KeyValueStatusMaintenance,
  KeyValueNotificationProfile,
  KeyValueFrequencyMaintenance,
  StatusMaintenanceScheduleEnum,
  KeyValueStatusMaintenanceSchedule,
  StatusCourtesyEnum,
  KeyValueStatusCourtesy,
} from '../models';

export class SetDescription {
  keyValuePh = new KeyValuePh();
  keyValuePool = new KeyValuePool();
  keyValueShift = new KeyValueShift();
  keyValueStatus = new KeyValueStatus();
  keyValueChlorine = new KeyValueChlorine();
  keyValueHistoric = new KeyValueHistoric();
  keyValueWaterTank = new KeyValueWaterTank();
  keyValueBrineTank = new KeyValueBrineTank();
  keyValueEquipment = new KeyValueEquipment();
  keyValueAlkalinity = new KeyValueAlkalinity();
  keyValueVoucher = new KeyValueStatusVoucher();
  keyValueTypePerson = new KeyValueTypePerson();
  keyValueCourtesy = new KeyValueStatusCourtesy();
  keyValueTypeMaintenance = new KeyValueTypeMaintenance();
  keyValueStatusMaintenance = new KeyValueStatusMaintenance();
  keyValueNotificationProfile = new KeyValueNotificationProfile();
  keyValueFrequencyMaintenance = new KeyValueFrequencyMaintenance();
  keyValueStatusMaintenanceSchedule = new KeyValueStatusMaintenanceSchedule();

  public courtesy(courtesy: string) {
    return this.hasDescription(this.keyValueCourtesy.getKeyByValue(courtesy), StatusCourtesyEnum);
  }

  public ph(ph: string) {
    return this.hasDescription(this.keyValuePh.getKeyByValue(ph), PhEnum);
  }

  public waterTank(waterTank: string) {
    return this.hasDescription(this.keyValueWaterTank.getKeyByValue(waterTank), WaterTankEnum);
  }

  public brineTank(brineTank: string) {
    return this.hasDescription(this.keyValueBrineTank.getKeyByValue(brineTank), BrineTankEnum);
  }

  public shift(shift: string) {
    return this.hasDescription(this.keyValueShift.getKeyByValue(shift), ShiftEnum);
  }

  public status(status: string) {
    return this.hasDescription(this.keyValueStatus.getKeyByValue(status), StatusEnum);
  }

  public pool(pool: string) {
    return this.hasDescription(this.keyValuePool.getKeyByValue(pool), PoolEnum);
  }

  public chlorine(chlorine: string) {
    return this.hasDescription(this.keyValueChlorine.getKeyByValue(chlorine), ChlorineEnum);
  }

  public alkalinity(alkalinity: string) {
    return this.hasDescription(this.keyValueAlkalinity.getKeyByValue(alkalinity), AlkalinityEnum);
  }

  public typePerson(typePerson: string) {
    return this.hasDescription(this.keyValueTypePerson.getKeyByValue(typePerson), TypePersonEnum);
  }

  public equipment(equipment: string) {
    return this.hasDescription(this.keyValueEquipment.getKeyByValue(equipment), StatusEquipmentEnum);
  }

  public historic(historic: string) {
    return this.hasDescription(this.keyValueHistoric.getKeyByValue(historic), StatusHistoricEnum);
  }

  public statusMaintenance(maintenance: string) {
    return this.hasDescription(this.keyValueStatusMaintenance.getKeyByValue(maintenance), StatusMaintenanceEnum);
  }

  public notificationProfile(notificationProfile: string) {
    return this.hasDescription(
      this.keyValueNotificationProfile.getKeyByValue(notificationProfile),
      NotificationProfileEnum,
    );
  }

  public frequency(frequency: string) {
    return this.hasDescription(this.keyValueFrequencyMaintenance.getKeyByValue(frequency), FrequencyMaintenanceEnum);
  }

  public statusMaintenanceSchedule(maintenance: string) {
    return this.hasDescription(
      this.keyValueStatusMaintenanceSchedule.getKeyByValue(maintenance),
      StatusMaintenanceScheduleEnum,
    );
  }

  public typeMaintenance(maintenance: string) {
    return this.hasDescription(this.keyValueTypeMaintenance.getKeyByValue(maintenance), TypeMaintenanceEnum);
  }

  public voucher(voucher: string) {
    return this.hasDescription(this.keyValueVoucher.getKeyByValue(voucher), StatusVoucherEnum);
  }

  protected hasDescription(key: any, data: { [key: string]: any }): string {
    if (key) {
      const valueOfKey = data[key];
      return valueOfKey;
    }

    return '';
  }
}
