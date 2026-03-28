import { createAction, props } from '@ngrx/store';

import { ContentProps, EventFilters, Group } from 'src/app/models';

export const setParamsGroups = createAction('[Group] Params', props<{ params: EventFilters }>());
export const isEditingGroup = createAction('[Group] IsEditing', props<{ isEditing: boolean }>());

/* Search Group */
export const searchGroup = createAction('[Group] Search');
export const searchGroupError = createAction('[Group] Search Error');
export const searchGroupSuccess = createAction('[Group] Search Success', props<{ data: ContentProps }>());

/* Create Group */
export const createGroupError = createAction('[Group] Create Error');
export const createGroupSuccess = createAction('[Group] Create Success');
export const createGroup = createAction('[Group] Create', props<{ payload: Group.Input }>());

/* Update Group */
export const updateGroupError = createAction('[Group] Update Error');
export const updateGroupSuccess = createAction('[Group] Update Success');
export const updateGroup = createAction('[Group] Update', props<{ id: number; payload: Group.Input }>());

/* Delete Group */
export const deleteGroupError = createAction('[Group] Delete Error');
export const deleteGroupSuccess = createAction('[Group] Delete Success');
export const deleteGroup = createAction('[Group] Delete Group', props<{ payload: number }>());
