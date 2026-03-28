import { createAction, props } from '@ngrx/store';

import {
  ByStatusDTO,
  EquipmentsTotalDTO,
  MaintenancesTotalDTO,
  StatisticsFilter,
  TopEquipmentsDTO,
} from 'src/app/models';

export const setFilterStatisticsEquipments = createAction(
  '[Statistics Equipments] Filter',
  props<{ filter: StatisticsFilter }>(),
);

/* Total Equipments*/
export const totalEquipments = createAction('[Statistics Equipments] Total Equipments');
export const totalEquipmentsError = createAction('[Statistics Equipments] Total Equipments Error');
export const totalEquipmentsSuccess = createAction(
  '[Statistics Equipments] Total Equipments Success',
  props<{ equipmentsTotalDTO: EquipmentsTotalDTO }>(),
);

/* Total Maintenances*/
export const totalMaintenances = createAction('[Statistics Maintenances] Total Maintenances');
export const totalMaintenancesError = createAction('[Statistics Maintenances] Total Maintenances Error');
export const totalMaintenancesSuccess = createAction(
  '[Statistics Maintenances] Total Maintenances Success',
  props<{ maintenancesTotalDTO: MaintenancesTotalDTO }>(),
);

/* Top Equipments*/
export const topEquipments = createAction('[Statistics Equipments] Top Equipments');
export const topEquipmentsError = createAction('[Statistics Equipments] Top Equipments Error');
export const topEquipmentsSuccess = createAction(
  '[Statistics Equipments] Top Equipments Success',
  props<{ topEquipments: TopEquipmentsDTO[] }>(),
);

/* By Status*/
export const byStatusEquipments = createAction('[Statistics Equipments] By Status');
export const byStatusEquipmentsError = createAction('[Statistics Equipments] By Status Error');
export const byStatusEquipmentsSuccess = createAction(
  '[Statistics Equipments] By Status Success',
  props<{ byStatus: ByStatusDTO[] }>(),
);
