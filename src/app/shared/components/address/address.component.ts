import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskDirective } from 'ngx-mask';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { Address, City, PostalCodeModel, State, StateModel } from 'src/app/models';
import * as citiesStore from 'src/app/store/actions/cities.actions';
import * as stateStore from 'src/app/store/actions/states.actions';

import { ErrorMsgComponent } from '../../error-msg/error-msg.component';
import { StringUtils } from '../../util';
import { MasterBaseDetailComponent } from '../base-resource-form/master-base-detail-component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styles: [],
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    SharedModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ErrorMsgComponent,
    NgxMaskDirective,
    InputTextModule,
    DropdownModule,
  ],
})
export class AddressComponent extends MasterBaseDetailComponent<City.Model> implements OnInit {
  states: StateModel[] = [];
  mask: string = '00.000-000';
  cities: { value: number; label: string }[] = [];

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public override ngOnInit() {
    super.ngOnInit();
    this.loadState();
  }

  public consultPostalCode() {
    const cep = StringUtils.onlyNumbers(this.postalCode.value);

    if (cep.length < 8) return;

    this.store.dispatch(stateStore.consultPostalCode({ cep }));

    this.store
      .select('stateState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ address }) => {
        if (address) {
          this.patchValue(address);
        }
      });
  }

  public onChange(event: DropdownChangeEvent) {
    this.destroy();
    this.cities = [];
    this.city.reset();

    this.loadCity(event.value.uf);
  }

  public override editEntry(resource: Address.Model) {
    this.cities = [];
    const state = resource.city.state;
    this.resourceForm.patchValue(resource);

    if (state) {
      this.resourceForm.patchValue({
        state,
      });

      if (state.uf) {
        this.loadCity(state.uf);
      }

      this.patchValueCity(state.uf, resource.city.name);
    }
    this.resourceDialog = true;
  }

  protected patchValue(address: PostalCodeModel) {
    const state = this.getStateByUf(address.uf);

    this.resourceForm.patchValue({
      burgh: address.bairro,
      complement: address.complemento,
      postalCode: address.cep,
      street: address.logradouro,
    });

    if (state) {
      this.resourceForm.patchValue({
        state: {
          uf: state.uf,
          id: state.value,
          name: state.label,
        },
      });
      this.loadCity(state.uf);
    }

    this.patchValueCity(address.uf, address.localidade);
  }

  public override saveResources() {
    if (this.resourceForm.valid) {
      if (this.id.value) {
        this.resources[this.findIndexById(this.id.value)] = this.toAddressModel();
      } else if (this.indexEdit === -1) {
        this.resources.push(this.toAddressModel());
      } else {
        this.resources[this.indexEdit] = this.toAddressModel();
      }

      this.resources = [...this.resources];
      this.resourceDialog = false;
      this.resourceForm.reset();
    } else {
      this.error.checkFormValidations(this.resourceForm);
    }

    this.indexEdit = -1;
  }

  protected toAddressModel() {
    const addressDTO: City.Input = {
      ...this.resourceForm.value,
      city: this.toCityModel(),
    };
    return addressDTO;
  }

  protected toCityModel() {
    return {
      id: this.cityId.value,
      name: this.cityName.value,
      state: {
        uf: this.stateUf.value,
        id: this.stateId.value,
        name: this.stateName.value,
      },
    };
  }

  protected loadCity(payload: string) {
    this.store.dispatch(citiesStore.searchCityByUf({ payload }));

    this.store
      .select('cityState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ cities }) => {
        if (!this.objectIsEmpty(cities)) {
          this.cities = cities.map((c: City.Model) => ({
            value: c.id,
            label: c.name,
          }));
        }
      });
  }

  protected loadState() {
    this.store.dispatch(stateStore.searchState());

    this.store
      .select('stateState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ allState }) => {
        if (allState) {
          this.states = allState.map((p: State.Model) => ({
            uf: p.uf,
            value: p.id,
            label: p.name,
          }));
        }
      });
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      complement: [null],
      burgh: [null, [Validators.required]],
      number: [null, [Validators.required]],
      street: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],

      city: this.formBuilder.group({
        name: [],
        id: [null, [Validators.required]],
      }),
      state: this.formBuilder.group({
        uf: [],
        name: [],
        id: [null, [Validators.required]],
      }),
    });
  }

  protected getStateByUf(uf?: string): StateModel {
    if (uf) {
      const result = this.states.filter((obj: StateModel) => {
        return obj.uf === uf;
      });

      return result[0];
    }
    return {
      uf: '',
      label: '',
      value: 0,
    };
  }

  protected patchValueCity(state: string, city: string) {
    if (city) {
      this.store.dispatch(citiesStore.searchNameAndState({ state, city }));

      this.store
        .select('cityState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ city }) => {
          if (!this.objectIsEmpty(city)) {
            this.resourceForm.patchValue({
              city,
            });
          }
        });
    }
  }

  get burgh(): FormControl {
    return this.resourceForm.get('burgh') as FormControl;
  }

  get complement(): FormControl {
    return this.resourceForm.get('complement') as FormControl;
  }

  get number(): FormControl {
    return this.resourceForm.get('number') as FormControl;
  }

  get postalCode(): FormControl {
    return this.resourceForm.get('postalCode') as FormControl;
  }

  get street(): FormControl {
    return this.resourceForm.get('street') as FormControl;
  }

  get cityId(): FormControl {
    return this.resourceForm.get('city.id') as FormControl;
  }

  get cityName(): FormControl {
    return this.resourceForm.get('city.name') as FormControl;
  }

  get city(): FormControl {
    return this.resourceForm.get('city') as FormControl;
  }

  get state(): FormControl {
    return this.resourceForm.get('state') as FormControl;
  }

  get stateUf(): FormControl {
    return this.resourceForm.get('state.uf') as FormControl;
  }

  get stateName(): FormControl {
    return this.resourceForm.get('state.name') as FormControl;
  }

  get stateId(): FormControl {
    return this.resourceForm.get('state.id') as FormControl;
  }
}
