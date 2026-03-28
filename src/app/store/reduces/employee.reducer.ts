import { Action, createReducer, on } from '@ngrx/store';
import { Employee } from 'src/app/models';

import * as actions from 'src/app/store/actions/employees.actions';

export interface EmployeeState {
  employee: Employee.Model[];
  allEmployees: Employee.Model[];
}

export const initialEmployeeState: EmployeeState = {
  employee: [],
  allEmployees: [],
};

export const _employeeReducer = createReducer(
  initialEmployeeState,

  /* Search All User */
  on(actions.searchAllEmployee, (state) => ({ ...state, isLoading: true })),

  on(actions.searchAllEmployeeSuccess, (state, { allEmployees }) => ({
    ...state,
    allEmployees,
    isLoading: false,
  })),

  on(actions.searchAllEmployeeError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Search Employee*/
  on(actions.searchEmployees, (state) => ({ ...state })),

  on(actions.searchEmployeesSuccess, (state, { employee }) => ({
    ...state,
    employee,
  })),

  on(actions.searchEmployeesError, (state) => ({
    ...state,
  })),

  /* Activation Employee */
  on(actions.activationEmployee, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationEmployeeSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationEmployeeError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate Employee */
  on(actions.deactivateEmployee, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivateEmployeeSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivateEmployeeError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),
);

export function employeeReducer(state: EmployeeState = initialEmployeeState, actions: Action) {
  return _employeeReducer(state, actions);
}
