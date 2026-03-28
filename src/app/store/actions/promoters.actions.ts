import { createAction, props } from '@ngrx/store';

import { Promoter } from 'src/app/models';

/* Search Promoters*/
export const searchPromoter = createAction('[Promoter] Search');
export const searchPromoterError = createAction('[Promoter] Search Error');
export const searchPromoterSuccess = createAction('[Promoter] Search Success', props<{ promoter: Promoter.Model[] }>());

/* Activation Promoters */
export const activationPromoterError = createAction('[Promoters] Activation Error');
export const activationPromoterSuccess = createAction('[Promoters] Activation Success');
export const activationPromoter = createAction('[Promoters] Activation', props<{ payload: number }>());

/* Deactivate Promoters */
export const deactivatePromoterError = createAction('[Promoters] Deactivate Error');
export const deactivatePromoterSuccess = createAction('[Promoters] Deactivate Success');
export const deactivatePromoter = createAction('[Promoters] Deactivate', props<{ payload: number }>());
