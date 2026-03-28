import { HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { EventFilters, Product, SortMeta } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseResourceService<Product.Input> {
  constructor(protected override injector: Injector) {
    super('v1/products', injector);
  }

  public searchFoods() {
    return this.http.get(`${this.apiPathUrl}/foods/${1}`).pipe(map(this.extractData));
  }

  public searchTickets() {
    return this.http.get(`${this.apiPathUrl}/tickets/${1}`).pipe(map(this.extractData));
  }

  public searchType(typeProduct: string, event: EventFilters) {
    let params = new HttpParams({});
    let status = ['Active'];

    if (event) {
      for (const m in event.filters) {
        const first = event.filters[m][0];
        if (first.value !== null) {
          status = [];
        }
      }

      const sortField = event.sortField;
      const multiSortMeta = event.multiSortMeta;

      params = params.append('size', event.rows);
      params = params.append('page', parseInt(JSON.stringify(event.first)) / parseInt(JSON.stringify(event.rows)));

      if (sortField) {
        params = params.append('sort', `${sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}`);
      }

      if (multiSortMeta) {
        multiSortMeta.forEach((m: SortMeta) => {
          params = params.append('sort', `${m.field},${m.order === 1 ? 'asc' : 'desc'}`);
        });
      }
    }
    params = params.append('filters', JSON.stringify(this.setParamsProducts(event, typeProduct, status)));

    return this.http.get<Product.Model[]>(`${this.apiPathUrl}`, { params }).pipe(map(this.extractDataPageable));
  }

  private setParamsProducts(params: EventFilters, typeProduct: string, status: string[]) {
    if (params) {
      return {
        status,
        typeProduct,
        rows: params.rows,
        first: params.first,
        filters: params.filters,
        sortOrder: params.sortOrder,
        globalFilter: params.globalFilter,
      };
    } else {
      return {
        status,
        typeProduct,
        filters: null,
      };
    }
  }
}
