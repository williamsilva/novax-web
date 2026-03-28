import { AgentsEffects } from './agents.effects';
import { VouchersCancellationReasonsEffects } from './cancellation-reason.effects';
import { ChlorineParametersEffects } from './chlorine-parameters.effects';
import { CitiesEffects } from './cities.effects';
import { ClientsEffects } from './clients.effects';
import { ConfigVouchersEffects } from './config-voucher.effects';
import { CourtesyEffects } from './courtesy.effects';
import { EmployeesEffects } from './employees.effects';
import { EquipmentEffects } from './equipment.effects';
import { FleetsEffects } from './fleets.effects';
import { GroupsPermissionEffects } from './groups-permission.effects';
import { GroupsUserEffects } from './groups-user.effects';
import { GroupsEffects } from './groups.effects';
import { HistoricEffects } from './historic.effects';
import { LocationEffects } from './location.effects';
import { MaintenanceScheduleEffects } from './maintenance-schedule.effects';
import { MaintenanceEffects } from './maintenance.effects';
import { PoolParametersEffects } from './pool-parameters.effects';
import { ProductsEffects } from './products.effects';
import { PromotersEffects } from './promoters.effects';
import { ProvidersEffects } from './providers.effects';
import { StatesEffects } from './states.effects';
import { StatisticsEquipmentsEffects } from './statistics-equipments.effects';
import { StatisticsVoucherEffects } from './statistics-vouchers.effects';
import { TourGuidesEffects } from './tour-guide.effects';
import { UsersEffects } from './users.effects';
import { VouchersEffects } from './vouchers.effects';

export const EffectsArray = [
  UsersEffects,
  FleetsEffects,
  AgentsEffects,
  StatesEffects,
  CitiesEffects,
  GroupsEffects,
  ClientsEffects,
  ProductsEffects,
  CourtesyEffects,
  VouchersEffects,
  HistoricEffects,
  LocationEffects,
  ProvidersEffects,
  PromotersEffects,
  TourGuidesEffects,
  EmployeesEffects,
  EquipmentEffects,
  GroupsUserEffects,
  MaintenanceEffects,
  ConfigVouchersEffects,
  PoolParametersEffects,
  GroupsPermissionEffects,
  StatisticsVoucherEffects,
  ChlorineParametersEffects,
  MaintenanceScheduleEffects,
  StatisticsEquipmentsEffects,
  VouchersCancellationReasonsEffects,
];
