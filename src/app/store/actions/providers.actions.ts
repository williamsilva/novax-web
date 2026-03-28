import { createAction, props } from '@ngrx/store';

import { Provider } from 'src/app/models';

/* Activation Providers */
export const activationProviderError = createAction('[Providers] Activation Error');
export const activationProviderSuccess = createAction('[Providers] Activation Success');
export const activationProvider = createAction('[Providers] Activation', props<{ payload: number }>());

/* Deactivate Providers */
export const deactivateProviderError = createAction('[Providers] Deactivate Error');
export const deactivateProviderSuccess = createAction('[Providers] Deactivate Success');
export const deactivateProvider = createAction('[Providers] Deactivate', props<{ payload: number }>());

/* Search Providers*/
export const searchProvider = createAction('[Provider] Search');
export const searchProviderError = createAction('[Provider] Search Error');
export const searchProviderSuccess = createAction('[Provider] Search Success', props<{ provider: Provider.Model[] }>());
