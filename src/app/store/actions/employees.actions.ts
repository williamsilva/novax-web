import { createAction, props } from '@ngrx/store';

import { Employee } from 'src/app/models';

/* Activation Employees */
export const activationEmployeeError = createAction('[Employees] Activation Error');
export const activationEmployeeSuccess = createAction('[Employees] Activation Success');
export const activationEmployee = createAction('[Employees] Activation', props<{ payload: number }>());

/* Deactivate Employees */
export const deactivateEmployeeError = createAction('[Employees] Deactivate Error');
export const deactivateEmployeeSuccess = createAction('[Employees] Deactivate Success');
export const deactivateEmployee = createAction('[Employees] Deactivate', props<{ payload: number }>());

/* Search Employees*/
export const searchEmployees = createAction('[Employees] Search');
export const searchEmployeesError = createAction('[Employees] Search Error');
export const searchEmployeesSuccess = createAction(
  '[Employees] Search Success',
  props<{ employee: Employee.Model[] }>(),
);

/* Search All Employee */
export const searchAllEmployee = createAction('[User] Search All');
export const searchAllEmployeeError = createAction('[User] Search All Error');
export const searchAllEmployeeSuccess = createAction(
  '[User] Search All Success',
  props<{ allEmployees: Employee.Model[] }>(),
);
