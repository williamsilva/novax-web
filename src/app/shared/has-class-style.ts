import {
  PhEnum,
  PoolEnum,
  ShiftEnum,
  StatusEnum,
  KeyValuePh,
  KeyValuePool,
  ChlorineEnum,
  WaterTankEnum,
  KeyValueShift,
  BrineTankEnum,
  AlkalinityEnum,
  KeyValueStatus,
  TypePersonEnum,
  KeyValueHistoric,
  KeyValueChlorine,
  KeyValueBrineTank,
  KeyValueEquipment,
  KeyValueWaterTank,
  StatusVoucherEnum,
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

export class HasClassStyle {
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

  public courtesy(status: string) {
    if (
      status === this.keyValueCourtesy.getValue(this.getKeyByValueEnum(StatusCourtesyEnum, StatusCourtesyEnum.Pending))
    ) {
      return 'new';
    }

    if (
      status ===
      this.keyValueCourtesy.getValue(this.getKeyByValueEnum(StatusCourtesyEnum, StatusCourtesyEnum.Exchanged))
    ) {
      return 'qualified';
    }

    if (
      status === this.keyValueCourtesy.getValue(this.getKeyByValueEnum(StatusCourtesyEnum, StatusCourtesyEnum.Expired))
    ) {
      return 'renewal';
    }

    if (
      status === this.keyValueCourtesy.getValue(this.getKeyByValueEnum(StatusCourtesyEnum, StatusCourtesyEnum.Canceled))
    ) {
      return 'unqualified';
    }

    return;
  }

  public ph(status: string) {
    if (status === this.keyValuePh.getValue(this.getKeyByValueEnum(PhEnum, PhEnum.Ph_68))) {
      return 'new';
    }

    if (status === this.keyValuePh.getValue(this.getKeyByValueEnum(PhEnum, PhEnum.Ph_70))) {
      return 'qualified';
    }

    if (status === this.keyValuePh.getValue(this.getKeyByValueEnum(PhEnum, PhEnum.Ph_72))) {
      return 'unqualified';
    }

    if (status === this.keyValuePh.getValue(this.getKeyByValueEnum(PhEnum, PhEnum.Ph_74))) {
      return 'negotiation';
    }

    if (status === this.keyValuePh.getValue(this.getKeyByValueEnum(PhEnum, PhEnum.Ph_76))) {
      return 'renewal';
    }

    if (status === this.keyValuePh.getValue(this.getKeyByValueEnum(PhEnum, PhEnum.Ph_78))) {
      return 'proposal';
    }

    return;
  }

  public pool(status: string) {
    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Biribol))) {
      return 'new';
    }

    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Coral))) {
      return 'qualified';
    }

    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Fall_Water_Slide))) {
      return 'unqualified';
    }

    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Pirate))) {
      return 'negotiation';
    }

    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Play))) {
      return 'renewal';
    }

    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Slow_River))) {
      return 'proposal';
    }

    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Strong))) {
      return 'notNew';
    }
    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Vulcan))) {
      return 'n1';
    }

    if (status === this.keyValuePool.getValue(this.getKeyByValueEnum(PoolEnum, PoolEnum.Wave_Pool))) {
      return 'n2';
    }

    return;
  }

  public shift(status: string) {
    if (status === this.keyValueShift.getValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.First))) {
      return 'new';
    }

    if (status === this.keyValueShift.getValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Second))) {
      return 'qualified';
    }

    if (status === this.keyValueShift.getValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Third))) {
      return 'renewal';
    }

    if (status === this.keyValueShift.getValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Fourth))) {
      return 'proposal';
    }

    if (status === this.keyValueShift.getValue(this.getKeyByValueEnum(ShiftEnum, ShiftEnum.Not_configured))) {
      return 'unqualified';
    }

    return;
  }

  public waterTank(status: string) {
    if (status === this.keyValueWaterTank.getValue(this.getKeyByValueEnum(WaterTankEnum, WaterTankEnum.Full))) {
      return 'new';
    }

    if (status === this.keyValueWaterTank.getValue(this.getKeyByValueEnum(WaterTankEnum, WaterTankEnum.Half))) {
      return 'qualified';
    }

    if (status === this.keyValueWaterTank.getValue(this.getKeyByValueEnum(WaterTankEnum, WaterTankEnum.Empty))) {
      return 'unqualified';
    }

    return;
  }

  public brineTank(status: string) {
    if (status === this.keyValueBrineTank.getValue(this.getKeyByValueEnum(BrineTankEnum, BrineTankEnum.Brine_1000))) {
      return 'new';
    }

    if (status === this.keyValueBrineTank.getValue(this.getKeyByValueEnum(BrineTankEnum, BrineTankEnum.Brine_200))) {
      return 'qualified';
    }

    if (status === this.keyValueBrineTank.getValue(this.getKeyByValueEnum(BrineTankEnum, BrineTankEnum.Brine_400))) {
      return 'unqualified';
    }

    if (status === this.keyValueBrineTank.getValue(this.getKeyByValueEnum(BrineTankEnum, BrineTankEnum.Brine_500))) {
      return 'negotiation';
    }

    if (status === this.keyValueBrineTank.getValue(this.getKeyByValueEnum(BrineTankEnum, BrineTankEnum.Brine_600))) {
      return 'renewal';
    }

    if (status === this.keyValueBrineTank.getValue(this.getKeyByValueEnum(BrineTankEnum, BrineTankEnum.Brine_700))) {
      return 'proposal';
    }

    if (status === this.keyValueBrineTank.getValue(this.getKeyByValueEnum(BrineTankEnum, BrineTankEnum.Brine_800))) {
      return 'notNew';
    }

    if (status === this.keyValueBrineTank.getValue(this.getKeyByValueEnum(BrineTankEnum, BrineTankEnum.Brine_900))) {
      return 'n1';
    }

    return;
  }

  public chlorine(status: string) {
    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_00))) {
      return 'new';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_05))) {
      return 'qualified';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_10))) {
      return 'unqualified';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_15))) {
      return 'negotiation';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_20))) {
      return 'renewal';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_25))) {
      return 'proposal';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_30))) {
      return 'notNew';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_35))) {
      return 'n1';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_40))) {
      return 'n2';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_45))) {
      return 'n3';
    }

    if (status === this.keyValueChlorine.getValue(this.getKeyByValueEnum(ChlorineEnum, ChlorineEnum.Chlorine_50))) {
      return 'n4';
    }

    return;
  }

  public alkalinity(status: string) {
    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_10))
    ) {
      return 'new';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_20))
    ) {
      return 'qualified';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_30))
    ) {
      return 'unqualified';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_40))
    ) {
      return 'negotiation';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_50))
    ) {
      return 'renewal';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_60))
    ) {
      return 'proposal';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_70))
    ) {
      return 'notNew';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_80))
    ) {
      return 'n1';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_90))
    ) {
      return 'n2';
    }

    if (
      status === this.keyValueAlkalinity.getValue(this.getKeyByValueEnum(AlkalinityEnum, AlkalinityEnum.Alkalinity_100))
    ) {
      return 'n3';
    }

    return;
  }

  public status(status: string) {
    if (status === this.keyValueStatus.getValue(this.getKeyByValueEnum(StatusEnum, StatusEnum.Active))) {
      return 'qualified';
    }

    if (status === this.keyValueStatus.getValue(this.getKeyByValueEnum(StatusEnum, StatusEnum.Blocked))) {
      return 'renewal';
    }

    if (status === this.keyValueStatus.getValue(this.getKeyByValueEnum(StatusEnum, StatusEnum.Inactive))) {
      return 'unqualified';
    }

    return;
  }

  public typePerson(status: string) {
    if (status === this.keyValueTypePerson.getValue(this.getKeyByValueEnum(TypePersonEnum, TypePersonEnum.Legal))) {
      return 'renewal';
    }

    if (status === this.keyValueTypePerson.getValue(this.getKeyByValueEnum(TypePersonEnum, TypePersonEnum.Physical))) {
      return 'new';
    }

    return;
  }

  public typeMaintenance(status: string) {
    if (
      status ===
      this.keyValueTypeMaintenance.getValue(this.getKeyByValueEnum(TypeMaintenanceEnum, TypeMaintenanceEnum.Predictive))
    ) {
      return 'renewal';
    }

    if (
      status ===
      this.keyValueTypeMaintenance.getValue(this.getKeyByValueEnum(TypeMaintenanceEnum, TypeMaintenanceEnum.Detective))
    ) {
      return 'new';
    }

    if (
      status ===
      this.keyValueTypeMaintenance.getValue(
        this.getKeyByValueEnum(TypeMaintenanceEnum, TypeMaintenanceEnum.Preventative),
      )
    ) {
      return 'unqualified';
    }

    if (
      status ===
      this.keyValueTypeMaintenance.getValue(
        this.getKeyByValueEnum(TypeMaintenanceEnum, TypeMaintenanceEnum.Urgent_correction),
      )
    ) {
      return 'qualified';
    }

    if (
      status ===
      this.keyValueTypeMaintenance.getValue(
        this.getKeyByValueEnum(TypeMaintenanceEnum, TypeMaintenanceEnum.Scheduled_correction),
      )
    ) {
      return 'proposal';
    }

    return;
  }

  public statusMaintenance(status: string) {
    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Approved),
      )
    ) {
      return 'renewal';
    }

    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Proposal),
      )
    ) {
      return 'new';
    }

    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Budget),
      )
    ) {
      return 'unqualified';
    }

    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Received),
      )
    ) {
      return 'qualified';
    }

    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Concerted),
      )
    ) {
      return 'proposal';
    }

    return;
  }

  public historic(status: string) {
    if (
      status === this.keyValueHistoric.getValue(this.getKeyByValueEnum(StatusHistoricEnum, StatusHistoricEnum.Removed))
    ) {
      return 'renewal';
    }

    if (
      status === this.keyValueHistoric.getValue(this.getKeyByValueEnum(StatusHistoricEnum, StatusHistoricEnum.Active))
    ) {
      return 'new';
    }

    if (
      status ===
      this.keyValueHistoric.getValue(this.getKeyByValueEnum(StatusHistoricEnum, StatusHistoricEnum.Maintenance))
    ) {
      return 'proposal';
    }
    if (
      status ===
      this.keyValueHistoric.getValue(this.getKeyByValueEnum(StatusHistoricEnum, StatusHistoricEnum.Discarded))
    ) {
      return 'unqualified';
    }

    return;
  }

  public notificationProfile(status: string) {
    if (
      status ===
      this.keyValueNotificationProfile.getValue(
        this.getKeyByValueEnum(NotificationProfileEnum, NotificationProfileEnum.Manager),
      )
    ) {
      return 'new';
    }

    if (
      status ===
      this.keyValueNotificationProfile.getValue(
        this.getKeyByValueEnum(NotificationProfileEnum, NotificationProfileEnum.Supervisor),
      )
    ) {
      return 'qualified';
    }

    if (
      status ===
      this.keyValueNotificationProfile.getValue(
        this.getKeyByValueEnum(NotificationProfileEnum, NotificationProfileEnum.User),
      )
    ) {
      return 'unqualified';
    }

    return;
  }

  public equipment(status: string) {
    if (
      status ===
      this.keyValueEquipment.getValue(this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Active))
    ) {
      return 'new';
    }

    if (
      status ===
      this.keyValueEquipment.getValue(this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Burned))
    ) {
      return 'qualified';
    }

    if (
      status ===
      this.keyValueEquipment.getValue(this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Discarded))
    ) {
      return 'renewal';
    }

    if (
      status ===
      this.keyValueEquipment.getValue(this.getKeyByValueEnum(StatusEquipmentEnum, StatusEquipmentEnum.Maintenance))
    ) {
      return 'unqualified';
    }

    return;
  }

  public voucher(status: string) {
    if (
      status === this.keyValueVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Not_closed))
    ) {
      return 'negotiation';
    }

    if (
      status === this.keyValueVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Dealing))
    ) {
      return 'new';
    }

    if (
      status === this.keyValueVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Exchanged))
    ) {
      return 'renewal';
    }

    if (
      status === this.keyValueVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Overdue))
    ) {
      return 'qualified';
    }

    if (
      status === this.keyValueVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Confirmed))
    ) {
      return 'proposal';
    }

    if (
      status === this.keyValueVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Called_off))
    ) {
      return 'unqualified';
    }

    return;
  }

  public frequency(status: string) {
    if (
      status ===
      this.keyValueFrequencyMaintenance.getValue(
        this.getKeyByValueEnum(FrequencyMaintenanceEnum, FrequencyMaintenanceEnum.Semi_annual),
      )
    ) {
      return 'new';
    }

    if (
      status ===
      this.keyValueFrequencyMaintenance.getValue(
        this.getKeyByValueEnum(FrequencyMaintenanceEnum, FrequencyMaintenanceEnum.Yearly),
      )
    ) {
      return 'renewal';
    }
    if (
      status ===
      this.keyValueFrequencyMaintenance.getValue(
        this.getKeyByValueEnum(FrequencyMaintenanceEnum, FrequencyMaintenanceEnum.Biweekly),
      )
    ) {
      return 'qualified';
    }
    if (
      status ===
      this.keyValueFrequencyMaintenance.getValue(
        this.getKeyByValueEnum(FrequencyMaintenanceEnum, FrequencyMaintenanceEnum.Monthly),
      )
    ) {
      return 'proposal';
    }
    if (
      status ===
      this.keyValueFrequencyMaintenance.getValue(
        this.getKeyByValueEnum(FrequencyMaintenanceEnum, FrequencyMaintenanceEnum.Quarterly),
      )
    ) {
      return 'unqualified';
    }
    if (
      status ===
      this.keyValueFrequencyMaintenance.getValue(
        this.getKeyByValueEnum(FrequencyMaintenanceEnum, FrequencyMaintenanceEnum.Weekly),
      )
    ) {
      return '';
    }

    return;
  }

  public statusMaintenanceSchedule(status: string) {
    if (
      status ===
      this.keyValueStatusMaintenanceSchedule.getValue(
        this.getKeyByValueEnum(StatusMaintenanceScheduleEnum, StatusMaintenanceScheduleEnum.Scheduled),
      )
    ) {
      return 'new';
    }

    if (
      status ===
      this.keyValueStatusMaintenanceSchedule.getValue(
        this.getKeyByValueEnum(StatusMaintenanceScheduleEnum, StatusMaintenanceScheduleEnum.Won),
      )
    ) {
      return 'renewal';
    }

    return;
  }

  protected getKeyByValueEnum(enumObj: any, valor: any): string {
    for (const key in enumObj) {
      if (enumObj[key] === valor) {
        return key;
      }
    }
    return '';
  }
}
