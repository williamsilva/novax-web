import { createAction, props } from '@ngrx/store';

import { TourGuide } from 'src/app/models';

/* Activation TourGuide */
export const activationTourGuideError = createAction('[TourGuide] Activation Error');
export const activationTourGuideSuccess = createAction('[TourGuide] Activation Success');
export const activationTourGuide = createAction('[TourGuide] Activation', props<{ payload: number }>());

/* Deactivate TourGuide */
export const deactivateTourGuideError = createAction('[TourGuide] Deactivate Error');
export const deactivateTourGuideSuccess = createAction('[TourGuide] Deactivate Success');
export const deactivateTourGuide = createAction('[TourGuide] Deactivate', props<{ payload: number }>());

/* Search TourGuide*/
export const searchTourGuides = createAction('[TourGuide] Search');
export const searchTourGuidesError = createAction('[TourGuide] Search Error');
export const searchTourGuidesSuccess = createAction(
  '[TourGuide] Search Success',
  props<{ tourGuide: TourGuide.Model[] }>(),
);

/* Search All TourGuide */
export const searchAllTourGuide = createAction('[TourGuide] Search All');
export const searchAllTourGuideError = createAction('[TourGuide] Search All Error');
export const searchAllTourGuideSuccess = createAction(
  '[TourGuide] Search All Success',
  props<{ allTourGuides: TourGuide.Model[] }>(),
);
