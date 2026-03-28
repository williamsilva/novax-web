import { Injector } from '@angular/core';

import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core';
import * as store from 'src/app/store';

export abstract class BaseEffects {
  protected actions$: Actions;
  protected store$: Store<store.AppState>;
  protected messageService: MessageService;
  protected errorHandler: ErrorHandlerService;

  constructor(protected injector: Injector) {
    this.store$ = injector.get(Store);
    this.actions$ = injector.get(Actions);
    this.messageService = injector.get(MessageService);
    this.errorHandler = injector.get(ErrorHandlerService);
  }

  protected getKeyByValueEnum(enumObj: any, valor: any): string {
    for (const key in enumObj) {
      if (enumObj[key] === valor) {
        return key;
      }
    }
    return '';
  }
}
