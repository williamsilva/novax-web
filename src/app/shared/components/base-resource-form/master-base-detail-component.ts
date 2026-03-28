import { Directive, Injector, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';

import { AuthService } from 'src/app/auth';
import * as store from 'src/app/store';
import { ErrorService } from '../../error-msg';

@Directive()
export abstract class MasterBaseDetailComponent<T> implements OnInit, OnDestroy {
  @Input()
  resources: any[] = [];

  indexEdit: number = -1;

  resourceForm!: FormGroup;
  selectedResources: T[] = [];
  resourceDialog: boolean = false;

  protected auth: AuthService;
  protected error: ErrorService;
  protected formBuilder: FormBuilder;
  protected store: Store<store.AppState>;
  protected destroy$ = new Subject<void>();
  protected confirmation: ConfirmationService;

  constructor(protected injector: Injector) {
    this.store = this.injector.get(Store);
    this.auth = this.injector.get(AuthService);
    this.error = this.injector.get(ErrorService);
    this.formBuilder = this.injector.get(FormBuilder);
    this.confirmation = this.injector.get(ConfirmationService);
  }

  ngOnInit(): void {
    this.buildResourceForm();
  }

  public ngOnDestroy() {
    this.destroy();
  }

  public destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openNew(event: any) {
    event.preventDefault();

    this.reset();
    this.indexEdit = -1;
    this.resourceForm.reset();
    this.resourceDialog = true;
  }

  public deleteSelectedEntries(event: any) {
    event.preventDefault();

    this.confirmation.confirm({
      message: 'Deseja excluir os itens selecionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedResources.forEach((resource) => {
          this.resources.splice(this.findIndex(resource), 1);
        });
        this.selectedResources = [];
      },
    });
  }

  public editEntry(resource: any) {
    this.indexEdit = this.findIndex(resource);
    this.resourceForm.patchValue(resource);
    this.resourceDialog = true;
  }

  public deleteEntry(resource: T) {
    this.confirmation.confirm({
      message: 'Deseja realmente excluir?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.resources.splice(this.findIndex(resource), 1);
      },
    });
  }

  public hideDialog(event: any) {
    event.preventDefault();
    this.resourceDialog = false;
    this.resourceForm.reset();
    this.destroy();
  }

  public saveResources(event: any) {
    event.preventDefault();

    if (this.resourceForm.valid) {
      if (this.id.value) {
        this.resources[this.findIndexById(this.id.value)] = this.resourceForm.value;
      } else if (this.indexEdit === -1) {
        this.resources.push(this.resourceForm.value);
      } else {
        this.resources[this.indexEdit] = this.resourceForm.value;
      }

      this.resources = [...this.resources];
      this.resourceDialog = false;
      this.resourceForm.reset();
    } else {
      this.error.checkFormValidations(this.resourceForm);
    }

    this.indexEdit = -1;
  }

  public reset() {}

  protected findIndex(resource: any) {
    for (let i = 0; i < this.resources.length; i += 1) {
      if (this.resources[i] === resource) {
        return i;
      }
    }
    return -1;
  }

  protected findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.resources.length; i++) {
      if (this.resources[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  protected objectIsEmpty(obj: any): boolean {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  protected abstract buildResourceForm(): void;

  get editing() {
    return Boolean(this.id.value);
  }

  get id(): FormControl {
    return this.resourceForm.get('id') as FormControl;
  }
}
