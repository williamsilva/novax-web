import { createAction, props } from '@ngrx/store';

import { City, ContentProps } from 'src/app/models';

/* Search City */
export const searchCityByUfError = createAction('[City] Search By Uf Error');
export const searchCityByUf = createAction('[City] Search By Uf', props<{ payload: string }>());
export const searchCityByUfSuccess = createAction('[City] Search By Uf Success', props<{ cities: City.Model[] }>());

/* Search Name And State */
export const searchNameAndStateError = createAction('[City] Search Name And State Error');
export const searchNameAndState = createAction(
  '[City] Search Name And State',
  props<{ state: string; city: string }>(),
);
export const searchNameAndStateSuccess = createAction(
  '[City] Search Name And State Success',
  props<{ city: ContentProps }>(),
);
