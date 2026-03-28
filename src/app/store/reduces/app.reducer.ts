import { ActionReducerMap } from '@ngrx/store';

import { agentReducer, AgentState } from './agent.reducer';
import { CancellationReasonState, cancellationReasonReducer } from './cancellation-reason.reducer';
import { chlorineParametersReducer, ChlorineParametersState } from './chlorine-parameters.reducer';
import { cityReducer, CityState } from './cities.reducer';
import { clientReducer, ClientState } from './client.reducer';
import { configVoucherReducer, ConfigVoucherState } from './config-vouchers.reducer';
import { employeeReducer, EmployeeState } from './employee.reducer';
import { equipmentReducer, EquipmentState } from './equipment.reducer';
import { groupPermissionReducer, GroupPermissionState } from './group-permission.reducer';
import { groupUserReducer, GroupUserState } from './group-user.reducer';
import { groupReducer, GroupState } from './group.reducer';
import { historicReducer, HistoricState } from './historic.reducer';
import { locationReducer, LocationState } from './location.reducer';
import { maintenanceScheduleReducer, MaintenanceScheduleState } from './maintenance-schedule.reducer';
import { MaintenanceState, maintenanceReducer } from './maintenance.reducer';
import { poolParametersReducer, PoolParametersState } from './pool-parameters.reducer';
import { productReducer, ProductState } from './product.reducer';
import { promoterReducer, PromoterState } from './promoter.reducer';
import { providerReducer, ProviderState } from './provider.reducer';
import { stateReducer, StateState } from './states.reducer';
import { statisticsVouchersReducer, StatisticsVouchersState } from './statistics-vouchers.reducer';
import { userReducer, UserState } from './user.reducer';
import { voucherReducer, VoucherState } from './voucher.reducer';
import { statisticsEquipmentsReducer, StatisticsEquipmentsState } from './statistics-equipments.reducer';
import { fleetsReducer, FleetsState } from './fleets.reducer';
import { courtesyReducer, CourtesyState } from './courtesy.reducer';
import { tourGuideReducer, TourGuideState } from './tour-guide.reducer';

export interface AppState {
  userState: UserState;
  cityState: CityState;
  stateState: StateState;
  agentState: AgentState;
  groupState: GroupState;
  fleetsState: FleetsState;
  clientState: ClientState;
  productState: ProductState;
  voucherState: VoucherState;
  providerState: ProviderState;
  employeeState: EmployeeState;
  locationState: LocationState;
  historicState: HistoricState;
  courtesyState: CourtesyState;
  promoterState: PromoterState;
  groupUserState: GroupUserState;
  equipmentState: EquipmentState;
  tourGuideState: TourGuideState;
  maintenanceState: MaintenanceState;
  configVoucherState: ConfigVoucherState;
  poolParametersState: PoolParametersState;
  groupPermissionState: GroupPermissionState;
  statisticsVouchersState: StatisticsVouchersState;
  cancellationReasonState: CancellationReasonState;
  chlorineParametersState: ChlorineParametersState;
  maintenanceScheduleState: MaintenanceScheduleState;
  statisticsEquipmentsState: StatisticsEquipmentsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  userState: userReducer,
  cityState: cityReducer,
  stateState: stateReducer,
  agentState: agentReducer,
  groupState: groupReducer,
  fleetsState: fleetsReducer,
  clientState: clientReducer,
  voucherState: voucherReducer,
  productState: productReducer,
  historicState: historicReducer,
  courtesyState: courtesyReducer,
  employeeState: employeeReducer,
  providerState: providerReducer,
  promoterState: promoterReducer,
  locationState: locationReducer,
  equipmentState: equipmentReducer,
  tourGuideState: tourGuideReducer,
  groupUserState: groupUserReducer,
  maintenanceState: maintenanceReducer,
  configVoucherState: configVoucherReducer,
  poolParametersState: poolParametersReducer,
  groupPermissionState: groupPermissionReducer,
  statisticsVouchersState: statisticsVouchersReducer,
  cancellationReasonState: cancellationReasonReducer,
  chlorineParametersState: chlorineParametersReducer,
  maintenanceScheduleState: maintenanceScheduleReducer,
  statisticsEquipmentsState: statisticsEquipmentsReducer,
};
