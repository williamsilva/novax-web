import { createAction, props } from '@ngrx/store';

import { PostalCodeModel, State } from 'src/app/models';

/* Search State */
export const searchState = createAction('[State] Search');
export const searchStateError = createAction('[State] Search Error');
export const searchStateSuccess = createAction('[State] Search Success', props<{ allState: State.Model[] }>());

/* Consult Postal Code */
export const consultPostalCodeError = createAction('[State] Consult Postal Code Error');
export const consultPostalCode = createAction('[State] Consult Postal Code', props<{ cep: string }>());
export const consultPostalCodeSuccess = createAction(
  '[State] Consult Postal Code Success',
  props<{ address: PostalCodeModel }>(),
);
