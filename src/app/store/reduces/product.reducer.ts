import { Action, createReducer, on } from '@ngrx/store';
import { ContentProps, EventFilters, Food, Ticket } from 'src/app/models';

import * as actions from 'src/app/store/actions/products.actions';

export interface ProductState {
  success: boolean;
  food: Food.Model[];
  isEditing: boolean;
  isLoading: boolean;
  data: ContentProps;
  typeProduct: string;
  params: EventFilters;
  ticket: Ticket.Model[];
}

export const initialProductState: ProductState = {
  food: [],
  ticket: [],
  success: false,
  typeProduct: '',
  isLoading: false,
  isEditing: false,
  data: { content: [], page: 0 },
  params: { rows: 0, first: 0, sortOrder: 0, sortField: '', globalFilter: '', filters: [], multiSortMeta: [] },
};

export const _productReducer = createReducer(
  initialProductState,

  on(actions.setParamsProducts, (state, { params }) => ({ ...state, params })),

  on(actions.setTypeProduct, (state, { typeProduct }) => ({ ...state, typeProduct })),

  on(actions.isEditingProduct, (state, { isEditing }) => ({ ...state, isLoading: false, isEditing })),

  /* load Foods Product */
  on(actions.loadFoodsProduct, (state) => ({ ...state, isLoading: true })),

  on(actions.loadFoodsProductSuccess, (state, { food }) => ({
    ...state,
    food,
    isLoading: false,
  })),

  on(actions.loadFoodsProductError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* load Tickets Product */
  on(actions.loadTicketsProduct, (state) => ({ ...state, isLoading: true })),

  on(actions.loadTicketsProductSuccess, (state, { ticket }) => ({
    ...state,
    ticket,
    isLoading: false,
  })),

  on(actions.loadTicketsProductError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* load Product */
  on(actions.loadProduct, (state) => ({ ...state, isLoading: true })),

  on(actions.loadProductSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
  })),

  on(actions.loadProductError, (state) => ({
    ...state,
    isLoading: false,
  })),

  /* Create Product */
  on(actions.createProduct, (state, { payload }) => ({ ...state, isLoading: true, payload, success: false })),

  on(actions.createProductSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.createProductError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Update Product */
  on(actions.updateProduct, (state, { id, payload }) => ({
    id,
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.updateProductSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.updateProductError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Activation Product */
  on(actions.activationProduct, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.activationProductSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.activationProductError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Deactivate Product */
  on(actions.deactivateProduct, (state, { payload }) => ({
    payload,
    ...state,
    success: false,
    isLoading: true,
  })),

  on(actions.deactivateProductSuccess, (state) => ({
    ...state,
    success: true,
    isLoading: false,
  })),

  on(actions.deactivateProductError, (state) => ({
    ...state,
    success: false,
    isLoading: false,
  })),

  /* Delete Product */
  on(actions.deleteProduct, (state, { payload }) => ({ ...state, isLoading: true, payload })),

  on(actions.deleteProductSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(actions.deleteProductError, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function productReducer(state: ProductState = initialProductState, actions: Action) {
  return _productReducer(state, actions);
}
