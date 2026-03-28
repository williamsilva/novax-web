import { Action, createReducer, on } from '@ngrx/store';

import { EquipmentsTotalDTO, MaintenancesTotalDTO, StatisticsFilter, TopEquipmentsDTO } from 'src/app/models';
import * as statisticsActions from '../actions/statistics-equipment.actions';

export interface StatisticsEquipmentsState {
  success: boolean;
  isLoading: boolean;
  filter: StatisticsFilter;
  topEquipments: TopEquipmentsDTO[];
  equipmentsTotalDTO: EquipmentsTotalDTO;
  maintenancesTotalDTO: MaintenancesTotalDTO;
  byStatus: { status: number; total: number }[];
}

export const initialStatisticsEquipmentsState: StatisticsEquipmentsState = {
  filter: {},
  byStatus: [],
  success: false,
  isLoading: false,
  topEquipments: [],
  equipmentsTotalDTO: { equipmentTotal: 0, totalValue: 0 },
  maintenancesTotalDTO: { maintenanceTotal: 0, totalMaintenance: 0, totalEquipmentsInMaintenance: 0 },
};

export const _statisticsEquipmentsReducer = createReducer(
  initialStatisticsEquipmentsState,

  on(statisticsActions.setFilterStatisticsEquipments, (state, { filter }) => ({ ...state, filter })),

  /* Total Maintenances */
  on(statisticsActions.totalMaintenances, (state) => ({ ...state, isLoading: true })),

  on(statisticsActions.totalMaintenancesSuccess, (state, { maintenancesTotalDTO }) => ({
    ...state,
    maintenancesTotalDTO,
    isLoading: false,
  })),

  on(statisticsActions.totalMaintenancesError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Total Equipments */
  on(statisticsActions.totalEquipments, (state) => ({ ...state, isLoading: true })),

  on(statisticsActions.totalEquipmentsSuccess, (state, { equipmentsTotalDTO }) => ({
    ...state,
    equipmentsTotalDTO,
    isLoading: false,
  })),

  on(statisticsActions.totalEquipmentsError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Top Equipments */
  on(statisticsActions.topEquipments, (state) => ({ ...state, isLoading: true })),

  on(statisticsActions.topEquipmentsSuccess, (state, { topEquipments }) => ({
    ...state,
    topEquipments,
    isLoading: false,
  })),

  on(statisticsActions.topEquipmentsError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* By Status */
  on(statisticsActions.byStatusEquipments, (state) => ({ ...state, isLoading: true })),

  on(statisticsActions.byStatusEquipmentsSuccess, (state, { byStatus }) => ({
    ...state,
    byStatus,
    isLoading: false,
  })),

  on(statisticsActions.byStatusEquipmentsError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function statisticsEquipmentsReducer(
  state: StatisticsEquipmentsState = initialStatisticsEquipmentsState,
  actions: Action,
) {
  return _statisticsEquipmentsReducer(state, actions);
}
