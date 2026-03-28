import { Injectable, Injector } from '@angular/core';

import { createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, of, withLatestFrom } from 'rxjs';

import { ProductService } from 'src/app/service';
import * as productsActions from '../actions/products.actions';
import { BaseEffects } from './base.effects';

@Injectable()
export class ProductsEffects extends BaseEffects {
  constructor(protected override injector: Injector, protected productService: ProductService) {
    super(injector);
  }

  loadFoodsProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.loadFoodsProduct),
      withLatestFrom(this.store$.select((state) => state.productState)),
      mergeMap(() =>
        this.productService.searchFoods().pipe(
          map((food) => productsActions.loadFoodsProductSuccess({ food })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(productsActions.loadFoodsProductError());
          }),
        ),
      ),
    ),
  );

  loadTicketsProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.loadTicketsProduct),
      withLatestFrom(this.store$.select((state) => state.productState)),
      mergeMap(() =>
        this.productService.searchTickets().pipe(
          map((ticket) => productsActions.loadTicketsProductSuccess({ ticket })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(productsActions.loadTicketsProductError());
          }),
        ),
      ),
    ),
  );

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.loadProduct),
      withLatestFrom(this.store$.select((state) => state.productState)),
      mergeMap(([, { params, typeProduct }]) =>
        this.productService.searchType(typeProduct, params).pipe(
          map((data) => productsActions.loadProductSuccess({ data })),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(productsActions.loadProductError());
          }),
        ),
      ),
    ),
  );

  createProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.createProduct),
      exhaustMap(({ payload }) =>
        this.productService.create(payload).pipe(
          map(() => {
            this.store$.dispatch(productsActions.loadProduct());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return productsActions.createProductSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(productsActions.createProductError());
          }),
        ),
      ),
    ),
  );

  updateProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.updateProduct),
      mergeMap(({ id, payload }) =>
        this.productService.updateById(id, payload).pipe(
          map(() => {
            this.store$.dispatch(productsActions.loadProduct());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return productsActions.updateProductSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(productsActions.updateProductError());
          }),
        ),
      ),
    ),
  );

  activationProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.activationProduct),
      mergeMap(({ payload }) =>
        this.productService.activation(payload).pipe(
          map(() => {
            this.store$.dispatch(productsActions.loadProduct());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return productsActions.activationProductSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(productsActions.activationProductError());
          }),
        ),
      ),
    ),
  );

  deactivateProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.deactivateProduct),
      mergeMap(({ payload }) =>
        this.productService.deactivate(payload).pipe(
          map(() => {
            this.store$.dispatch(productsActions.loadProduct());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return productsActions.deactivateProductSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(productsActions.deactivateProductError());
          }),
        ),
      ),
    ),
  );

  deleteProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productsActions.deleteProduct),
      mergeMap(({ payload }) =>
        this.productService.delete(payload).pipe(
          map(() => {
            this.store$.dispatch(productsActions.loadProduct());
            this.messageService.add({ severity: 'success', detail: 'Solicitação processada com sucesso!' });
            return productsActions.deleteProductSuccess();
          }),
          catchError((error) => {
            this.errorHandler.handle(error);
            return of(productsActions.deleteProductError());
          }),
        ),
      ),
    ),
  );
}
