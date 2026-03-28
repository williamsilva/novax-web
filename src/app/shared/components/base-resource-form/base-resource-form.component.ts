import { Directive, Injector, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';

import { AuthService } from 'src/app/auth';
import { ErrorHandlerService } from 'src/app/core';
import { KeyValueStatus, StatusEnum, wsPermissions } from 'src/app/models';
import { ErrorService } from 'src/app/shared';
import * as store from 'src/app/store';

@Directive()
export abstract class BaseResourceFormComponent<T> implements OnInit, OnDestroy {
  loading: boolean = false;
  isEditing: boolean = false;

  resourceForm!: FormGroup;
  statusEnum: SelectItem[] = [];
  wsPermissions = wsPermissions;
  keyValueStatusModel = new KeyValueStatus();

  keyValueStatus = new KeyValueStatus();

  public auth: AuthService;
  public error: ErrorService;
  protected formBuilder: FormBuilder;
  protected store: Store<store.AppState>;
  protected destroy$ = new Subject<void>();
  protected errorHandler: ErrorHandlerService;

  constructor(protected injector: Injector) {
    this.store = this.injector.get(Store);
    this.auth = this.injector.get(AuthService);
    this.error = this.injector.get(ErrorService);
    this.formBuilder = this.injector.get(FormBuilder);
    this.errorHandler = this.injector.get(ErrorHandlerService);
  }

  public ngOnInit(): void {
    this.statusEnum = this.setEnumValues(StatusEnum);
    this.buildResourceForm();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public reset(): void {
    this.resourceForm.reset();
  }

  public abstract submitForm(): void;

  public getValueKeyStatusByEnum(key: any): string {
    return this.keyValueStatus.getValue(this.getKeyByValueEnum(StatusEnum, key));
  }

  protected timeIsWithinInterval(startTime: string, horaFim: string): boolean {
    const currentDate: Date = new Date();
    const currentTime: number = currentDate.getHours();
    const minutesCurrent: number = currentDate.getMinutes();

    const timeStartArray: number[] = startTime.split(':').map(Number);
    const horaFimArray: number[] = horaFim.split(':').map(Number);

    const timeStartInMinutes: number = timeStartArray[0] * 60 + timeStartArray[1];
    const timeEndInMinutes: number = horaFimArray[0] * 60 + horaFimArray[1];
    const currentTimeInMinutes: number = currentTime * 60 + minutesCurrent;

    return currentTimeInMinutes >= timeStartInMinutes && currentTimeInMinutes <= timeEndInMinutes;
  }

  protected abstract buildResourceForm(): void;

  protected setEnumValues<T>(enumType: any): { label: string; value: keyof T }[] {
    const enumValues: { label: string; value: keyof T }[] = [];

    for (const key in enumType) {
      if (enumType.hasOwnProperty(key)) {
        enumValues.push({
          label: enumType[key as keyof T],
          value: key as keyof T,
        });
      }
    }

    return enumValues;
  }

  protected getKeyByValueEnum(enumObj: any, valor: any): string {
    for (const key in enumObj) {
      if (enumObj[key] === valor) {
        return key;
      }
    }
    return '';
  }

  protected objectIsEmpty(obj: any): boolean {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }
}
