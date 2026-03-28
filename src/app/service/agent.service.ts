import { HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { map } from 'rxjs';

import { Agent, EventFilters, SortMeta } from '../models';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root',
})
export class AgentService extends BaseResourceService<Agent.Input> {
  constructor(protected override injector: Injector) {
    super('v1/agents', injector);
  }

  public findByAgentType(agentType: number[]) {
    return this.http.get(`${this.apiPathUrl}/type/${agentType}`).pipe(map(this.extractData));
  }

  public findByDocument(document: string) {
    return this.http.get(`${this.apiPathUrl}/document/${document}`).pipe(map(this.extractData));
  }

  public searchByAgentType(event: EventFilters, agentType: string[], status: string[]) {
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
    params = params.append('filters', JSON.stringify(this.setParamsAgent(event, agentType, status)));

    return this.http.get<Agent.Model[]>(`${this.apiPathUrl}`, { params }).pipe(map(this.extractDataPageable));
  }

  private setParamsAgent(params: EventFilters, agentType: string[], status: string[]) {
    if (params) {
      return {
        status,
        agentType,
        rows: params.rows,
        first: params.first,
        filters: params.filters,
        sortOrder: params.sortOrder,
        globalFilter: params.globalFilter,
      };
    } else {
      return {
        status,
        agentType,
        filters: null,
      };
    }
  }
}
