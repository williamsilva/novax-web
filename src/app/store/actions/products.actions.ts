import { createAction, props } from '@ngrx/store';

import { Product, ContentProps, EventFilters, Ticket, Food } from 'src/app/models';

export const setParamsProducts = createAction('[Product] Params', props<{ params: EventFilters }>());
export const setTypeProduct = createAction('[Product] TypeProduct', props<{ typeProduct: string }>());
export const isEditingProduct = createAction('[Product] IsEditing', props<{ isEditing: boolean }>());

/* Load Foods Product */
export const loadFoodsProduct = createAction('[Product Foods] Load');
export const loadFoodsProductError = createAction('[Product Foods] Load Error');
export const loadFoodsProductSuccess = createAction('[Product Foods] Load Success', props<{ food: Food.Model[] }>());

/* Load Tickets Product */
export const loadTicketsProduct = createAction('[Product Tickets] Load');
export const loadTicketsProductError = createAction('[Product Tickets] Load Error');
export const loadTicketsProductSuccess = createAction(
  '[Product Tickets] Load Success',
  props<{ ticket: Ticket.Model[] }>(),
);

/* Load Product */
export const loadProduct = createAction('[Product] Load');
export const loadProductError = createAction('[Product] Load Error');
export const loadProductSuccess = createAction('[Product] Load Success', props<{ data: ContentProps }>());

/* Create Product */
export const createProductError = createAction('[Product] Create Error');
export const createProductSuccess = createAction('[Product] Create Success');
export const createProduct = createAction('[Product] Create', props<{ payload: Product.Input }>());

/* Update Product */
export const updateProductError = createAction('[Product] Update Error');
export const updateProductSuccess = createAction('[Product] Update Success');
export const updateProduct = createAction('[Product] Update', props<{ id: number; payload: Product.Input }>());

/* Activation Product */
export const activationProduct = createAction('[Product] Activation', props<{ payload: number }>());

export const activationProductSuccess = createAction('[Product] Activation Success');

export const activationProductError = createAction('[Product] Activation Error');

/* Deactivate Product */
export const deactivateProduct = createAction('[Product] Deactivate', props<{ payload: number }>());

export const deactivateProductSuccess = createAction('[Product] Deactivate Success');

export const deactivateProductError = createAction('[Product] Deactivate Error');

/* Delete Product */
export const deleteProduct = createAction('[Product] Delete Product', props<{ payload: number }>());

export const deleteProductSuccess = createAction('[Product] Delete Success');

export const deleteProductError = createAction('[Product] Delete Error');
