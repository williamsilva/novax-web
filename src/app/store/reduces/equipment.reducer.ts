import { Action, createReducer, on } from '@ngrx/store';

import { ContentProps, Equipment, EventFilters } from 'src/app/models';

import * as actions from 'src/app/store/actions/equipment.actions';

export interface EquipmentState {
  success: boolean;
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  params: EventFilters;
  paramsPatrimony: number;
  equipment: Equipment.Summary;
}

export const initialEquipmentState: EquipmentState = {
  equipment: {
    id: 0,
    price: 0,
    description: '',
    maintenances: [],
    patrimonyNumber: 0,
    buyDate: undefined,
    arrivalDate: undefined,
  },
  success: false,
  isLoading: false,
  isEditing: false,
  paramsPatrimony: 0,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _equipmentReducer = createReducer(
  initialEquipmentState,

  on(actions.setParamsEquipments, (state, { params }) => ({ ...state, params })),
  on(actions.isEditingEquipment, (state, { isEditing }) => ({ ...state, isEditing })),
  on(actions.setParamsPatrimony, (state, { paramsPatrimony }) => ({ ...state, paramsPatrimony })),

  /* Search Equipment */
  on(actions.searchEquipment, (state) => ({ ...state, isLoading: true })),

  on(actions.searchEquipmentSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.searchEquipmentError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Equipment */
  on(actions.createEquipment, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createEquipmentSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createEquipmentError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Equipment */
  on(actions.updateEquipment, (state, { uuid, payload }) => ({
    uuid,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateEquipmentSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateEquipmentError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Equipment */
  on(actions.deleteEquipment, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteEquipmentSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteEquipmentError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search Patrimony*/
  on(actions.searchPatrimony, (state) => ({ ...state })),

  on(actions.searchPatrimonySuccess, (state, { equipment }) => ({
    ...state,
    equipment,
  })),

  on(actions.searchPatrimonyError, (state) => ({
    ...state,
  })),
);

export function equipmentReducer(state: EquipmentState = initialEquipmentState, actions: Action) {
  return _equipmentReducer(state, actions);
}
