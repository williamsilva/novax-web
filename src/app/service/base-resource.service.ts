import { HttpClient, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, Subject } from 'rxjs';

import * as store from 'src/app/store';
import { environment } from 'src/environments/environment';
import { EventFilters, SortMeta } from '../models';

export abstract class BaseResourceService<T> {
  protected http: HttpClient;
  protected apiPathUrl: string;
  protected store: Store<store.AppState>;
  protected ngUnsubscribe = new Subject<void>();

  constructor(protected pathDefault: string, protected injector: Injector) {
    this.store = injector.get(Store);
    this.http = injector.get(HttpClient);

    this.apiPathUrl = `${environment.apiUrl}/${pathDefault}`;
  }

  public search(event: EventFilters) {
    let params = new HttpParams({});
    if (event) {
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
    params = params.append('filters', JSON.stringify(this.setParams(event)));

    return this.http.get<T[]>(`${this.apiPathUrl}`, { params }).pipe(map(this.extractDataPageable));
  }

  public searchByStatus(event: EventFilters, status: string[]) {
    let params = new HttpParams({});

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

    params = params.append('filters', JSON.stringify(this.setParamsByStatus(event, status)));

    return this.http.get<T[]>(`${this.apiPathUrl}`, { params }).pipe(map(this.extractDataPageable));
  }

  public findById(id: number) {
    return this.http.get(`${this.apiPathUrl}/${id}`).pipe(map(this.extractData));
  }

  public create(resource: T) {
    return this.http.post(this.apiPathUrl, resource).pipe(map(this.extractData));
  }

  public updateById(id: number, resource: T) {
    return this.http.put(`${this.apiPathUrl}/${id}`, resource).pipe(map(this.extractData));
  }

  public updateByUuid(uuid: string, resource: T) {
    return this.http.put(`${this.apiPathUrl}/${uuid}`, resource).pipe(map(this.extractData));
  }

  public deactivate(id: number) {
    return this.http.delete(`${this.apiPathUrl}/${id}/deactivate`).pipe(map(() => null));
  }

  public activation(id: number) {
    return this.http.put(`${this.apiPathUrl}/${id}/activation`, '').pipe(map(() => null));
  }

  public deactivateByUuid(uuid: string) {
    return this.http.delete(`${this.apiPathUrl}/${uuid}/deactivate`).pipe(map(() => null));
  }

  public activationByUuid(uuid: string) {
    return this.http.put(`${this.apiPathUrl}/${uuid}/activation`, '').pipe(map(() => null));
  }

  public deleteByUuid(uuid: number) {
    return this.http.delete(`${this.apiPathUrl}/${uuid}`).pipe(map(() => null));
  }

  public delete(id: number) {
    return this.http.delete(`${this.apiPathUrl}/${id}`).pipe(map(() => null));
  }

  protected extractData(response: any) {
    if (response._embedded) {
      return response._embedded.content || {};
    }
    return response;
  }

  protected extractDataPageable(response: any) {
    if (response._embedded) {
      return {
        content: response._embedded.content,
        page: response.page,
      };
    } else {
      return {
        content: [],
        page: response.page,
      };
    }
  }

  protected setParams(params: EventFilters) {
    if (params) {
      return {
        rows: params.rows,
        first: params.first,
        filters: params.filters,
        sortOrder: params.sortOrder,
        globalFilter: params.globalFilter,
      };
    } else {
      return {
        filters: null,
      };
    }
  }

  protected setParamsByStatus(params: any, status: any) {
    if (params) {
      return {
        status,
        rows: params.rows,
        first: params.first,
        filters: params.filters,
        sortOrder: params.sortOrder,
        globalFilter: params.globalFilter,
      };
    } else {
      return {
        status,
        filters: null,
      };
    }
  }
}
