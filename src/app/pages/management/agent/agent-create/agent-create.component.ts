import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { takeUntil } from 'rxjs';
import { zonedTimeToUtc } from 'date-fns-tz';
import { NgxMaskDirective } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectItem, SharedModule } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  SexEnum,
  wsConsts,
  StatusEnum,
  wsPermissions,
  TypeAgentEnum,
  CivilStateEnum,
  TypePersonEnum,
  KeyValueTypeAgent,
  KeyValueCivilState,
  KeyValueTypePerson,
  Agent,
  Options,
} from 'src/app/models';
import { getTimezone, CustomValidator } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as agentActions from 'src/app/store/actions/agents.actions';
import { AddressComponent } from '../../../../shared/components/address/address.component';
import { ContactsComponent } from '../../../../shared/components/contacts/contacts.component';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-agent-create',
  templateUrl: './agent-create.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [
    FormsModule,
    SharedModule,
    ButtonModule,
    TabViewModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    NgxMaskDirective,
    AddressComponent,
    ErrorMsgComponent,
    ContactsComponent,
    ReactiveFormsModule,
    RadioButtonModule,
  ],
})
export class AgentCreateComponent extends BaseResourceFormComponent<Agent.Input> implements OnInit {
  activeIndex: number = 0;

  sexRequired: boolean = false;
  disabledClients: boolean = true;
  disabledPromoters: boolean = true;
  disabledEmployees: boolean = true;
  disabledTourGuide: boolean = true;
  providerRequired: boolean = false;
  disabledProviders: boolean = true;
  promoterRequired: boolean = false;
  employeeRequired: boolean = false;
  tourGuideRequired: boolean = false;
  civilStateRequired: boolean = false;
  statusClientRequired: boolean = false;
  employeeManagerRequired: boolean = false;
  employeeAttendantRequired: boolean = false;

  mask: string = wsConsts.MASK_CPF;
  labelDocument: string = wsConsts.CPF;

  sexEnum: SelectItem[] = [];
  typesAgents: SelectItem[] = [];
  civilStateEnum: SelectItem[] = [];
  typePersonEnum: SelectItem[] = [];
  keyValueTypeAgent = new KeyValueTypeAgent();
  keyValueCivilState = new KeyValueCivilState();
  keyValueTypePerson = new KeyValueTypePerson();

  optionsCheck = [
    { value: true, label: 'Sim' },
    { value: false, label: 'Não' },
  ];
  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.sexEnum = this.setEnumValues(SexEnum);
    this.typesAgents = this.setEnumValues(TypeAgentEnum);
    this.typePersonEnum = this.setEnumValues(TypePersonEnum);
    this.civilStateEnum = this.setEnumValues(CivilStateEnum);

    this.store
      .select('agentState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing, agentType }) => {
        this.isEditing = isEditing;
        this.setAgentTypes(agentType);
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(agentActions.createAgent({ payload: this.toAgentModel() }));
      } else {
        const id = this.config.data.id;
        this.store.dispatch(agentActions.updateAgent({ id, payload: this.toAgentModel() }));
      }

      this.store
        .select('agentState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ isLoading, success }) => {
          this.loading = isLoading;
          if (success) {
            this.reset();
          }
        });
    } else {
      this.checkEros();
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  public onChangeTypePerson(event: DropdownChangeEvent) {
    this.patchTypePerson(event.value);
  }

  public onChangeName() {
    if (!this.socialReason.value) {
      this.socialReason.patchValue(this.name.value);
    }
  }

  public override reset(): void {
    this.ref.close();
  }

  public onChangeCheckbox(event: CheckboxChangeEvent) {
    this.onChangeAgentTypes(event.checked);
  }

  public readonlyCheckbox(value: string) {
    switch (value) {
      case this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Client): {
        return !this.auth.hasAnyPermission([wsPermissions.ROLE_CLIENTS_CREATE]);
      }

      case this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Provider): {
        return !this.auth.hasAnyPermission([wsPermissions.ROLE_PROVIDERS_CREATE]);
      }

      case this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Promoter): {
        return !this.auth.hasAnyPermission([wsPermissions.ROLE_PROMOTERS_CREATE]);
      }

      case this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Employee): {
        return !this.auth.hasAnyPermission([wsPermissions.ROLE_EMPLOYEES_CREATE]);
      }

      case this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Tour_Guide): {
        return !this.auth.hasAnyPermission([wsPermissions.ROLE_TOUR_GUIDE_CREATE]);
      }

      default: {
        return true;
      }
    }
  }

  public getValueKeyByEnum(key: string): string {
    return this.keyValueTypeAgent.getValue(this.getKeyByValueEnum(TypeAgentEnum, key));
  }

  protected onChangeAgentTypes(agentTypes: Options.ModelString[]) {
    if (!this.objectIsEmpty(agentTypes)) {
      const arrayList: string[] = [];

      agentTypes.forEach((a: Options.ModelString) => {
        arrayList.push(a.value);
      });

      if (arrayList.includes(this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Client))) {
        this.validClients();
      } else {
        this.resetClients();
      }

      if (arrayList.includes(this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Provider))) {
        this.validProviders();
      } else {
        this.resetProviders();
      }

      if (arrayList.includes(this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Promoter))) {
        this.validPromoters();
      } else {
        this.resetPromoters();
      }

      if (arrayList.includes(this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Employee))) {
        this.validEmployees();
      } else {
        this.resetEmployees();
      }

      if (arrayList.includes(this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Tour_Guide))) {
        this.validTourGuide();
      } else {
        this.resetTourGuide();
      }
    } else {
      this.activeIndex = 0;
      this.resetClients();
      this.resetProviders();
      this.resetPromoters();
      this.resetEmployees();
      this.resetTourGuide();
    }
  }

  protected validTourGuide() {
    this.disabledTourGuide = false;
    this.tourGuideRequired = true;

    this.statusTourGuide.setValidators([Validators.required]);
    this.statusTourGuide.updateValueAndValidity();
  }

  protected validEmployees() {
    this.disabledEmployees = false;
    this.employeeRequired = true;
    this.employeeManagerRequired = true;
    this.employeeAttendantRequired = true;

    this.statusEmployee.setValidators([Validators.required]);
    this.statusEmployee.updateValueAndValidity();
  }

  protected resetEmployees() {
    this.employeeRequired = false;
    this.employeeManagerRequired = false;
    this.employeeAttendantRequired = false;
    this.disabledEmployees = true;

    this.statusEmployee.reset();

    this.statusEmployee.clearValidators();
    this.statusEmployee.updateValueAndValidity();

    if (this.activeIndex === 4) {
      this.activeIndex = 0;
    }
  }

  protected validPromoters() {
    this.disabledPromoters = false;
    this.promoterRequired = true;

    this.statusPromoter.setValidators([Validators.required]);
    this.statusPromoter.updateValueAndValidity();
  }

  protected resetPromoters() {
    this.promoterRequired = false;
    this.disabledPromoters = true;

    this.statusPromoter.reset();

    this.statusPromoter.clearValidators();
    this.statusPromoter.updateValueAndValidity();

    if (this.activeIndex === 3) {
      this.activeIndex = 0;
    }
  }

  protected resetTourGuide() {
    this.tourGuideRequired = false;
    this.disabledTourGuide = true;

    this.statusTourGuide.reset();

    this.statusTourGuide.clearValidators();
    this.statusTourGuide.updateValueAndValidity();

    if (this.activeIndex === 3) {
      this.activeIndex = 0;
    }
  }

  protected validProviders() {
    this.disabledProviders = false;
    this.providerRequired = true;

    this.statusProvider.setValidators([Validators.required]);
    this.statusProvider.updateValueAndValidity();
  }

  protected resetProviders() {
    this.providerRequired = false;
    this.disabledProviders = true;

    this.statusProvider.reset();

    this.statusProvider.clearValidators();
    this.statusProvider.updateValueAndValidity();

    if (this.activeIndex === 2) {
      this.activeIndex = 0;
    }
  }

  protected validClients() {
    this.disabledClients = false;
    this.statusClientRequired = true;

    if (this.typePerson.value === this.getKeyByValueEnum(TypePersonEnum, TypePersonEnum.Physical)) {
      this.sexRequired = true;
      this.civilStateRequired = true;
      this.sex.setValidators([Validators.required]);
      this.civilState.setValidators([Validators.required]);
    } else {
      this.sexRequired = false;
      this.civilStateRequired = false;
      this.sex.clearValidators();
      this.civilState.clearValidators();
    }

    this.statusClient.setValidators([Validators.required]);

    this.sex.updateValueAndValidity();
    this.civilState.updateValueAndValidity();
    this.statusClient.updateValueAndValidity();
  }

  protected resetClients() {
    this.statusClientRequired = false;
    this.disabledClients = true;

    this.sex.reset();
    this.civilState.reset();
    this.statusClient.reset();

    this.sex.clearValidators();
    this.civilState.clearValidators();
    this.statusClient.clearValidators();

    this.sex.updateValueAndValidity();
    this.civilState.updateValueAndValidity();
    this.statusClient.updateValueAndValidity();

    if (this.activeIndex === 1) {
      this.activeIndex = 0;
    }
  }

  protected checkEros() {
    if (this.isErrorAgent()) {
      this.activeIndex = 0;
    }

    if (!this.isErrorAgent() && this.isErrorClient()) {
      this.activeIndex = 1;
    }

    if (!this.isErrorAgent() && !this.isErrorClient() && this.isErrorPromoter()) {
      this.activeIndex = 2;
    }

    if (!this.isErrorAgent() && !this.isErrorClient() && !this.isErrorPromoter() && this.isErrorProvider()) {
      this.activeIndex = 3;
    }

    if (
      !this.isErrorAgent() &&
      !this.isErrorClient() &&
      !this.isErrorProvider() &&
      !this.isErrorPromoter() &&
      this.isErrorEmployee()
    ) {
      this.activeIndex = 4;
    }
  }

  protected isErrorAgent() {
    if (this.name.valid && this.socialReason.valid && this.document.valid) {
      return false;
    }
    return true;
  }

  protected isErrorEmployee() {
    if (this.statusEmployee.valid) {
      return false;
    }
    return true;
  }

  protected isErrorTourGuide() {
    if (this.statusTourGuide.valid) {
      return false;
    }
    return true;
  }

  protected isErrorPromoter() {
    if (this.statusPromoter.valid) {
      return false;
    }
    return true;
  }

  protected isErrorProvider() {
    if (this.statusProvider.valid) {
      return false;
    }
    return true;
  }

  protected isErrorClient() {
    if (this.rg.valid && this.sex.valid && this.civilState.valid && this.birthDate.valid && this.statusClient.valid) {
      return false;
    }
    return true;
  }

  protected toAgentModel(): Agent.Input {
    const agentDTO: Agent.Input = {
      ...this.resourceForm.value,
      agentTypes: this.toAgentTypesModel(),
      civilState: this.keyValueCivilState.getValue(this.civilState.value),
      typePerson: this.keyValueTypePerson.getValue(this.typePerson.value),
      statusClient: this.keyValueStatusModel.getValue(this.statusClient.value),
      statusProvider: this.keyValueStatusModel.getValue(this.statusProvider.value),
      statusPromoter: this.keyValueStatusModel.getValue(this.statusPromoter.value),
      statusEmployee: this.keyValueStatusModel.getValue(this.statusEmployee.value),
      statusTourGuide: this.keyValueStatusModel.getValue(this.statusTourGuide.value),
    };

    return agentDTO;
  }

  protected toAgentTypesModel(): Agent.AgentTypeInput[] {
    const agentTypesDTO: Agent.AgentTypeInput[] = [];

    if (this.agentTypes.value) {
      this.agentTypes.value.forEach((a: Options.ModelString) => {
        agentTypesDTO.push({
          agentType: this.keyValueTypeAgent.getValue(a.value),
        });
      });
    }

    return agentTypesDTO;
  }

  protected buildResourceForm(): void {
    const status = this.getKeyByValueEnum(StatusEnum, StatusEnum.Active);
    const type = this.getKeyByValueEnum(TypePersonEnum, TypePersonEnum.Physical);

    this.resourceForm = this.formBuilder.group({
      rg: [null],
      sex: [null],
      typePerson: type,
      birthDate: [null],
      isManager: [false],
      agentTypes: [null],
      civilState: [null],
      isAttendant: [false],
      statusClient: status,
      statusProvider: status,
      statusPromoter: status,
      statusEmployee: status,
      statusTourGuide: status,
      code: [{ value: null, disabled: true }],

      document: [null, [Validators.required, CustomValidator.isValidCpf()]],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(60),
          CustomValidator.endsWithSpace(),
          CustomValidator.startsWithSpace(),
        ],
      ],
      socialReason: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(60),
          CustomValidator.endsWithSpace(),
          CustomValidator.startsWithSpace(),
        ],
      ],

      address: this.formBuilder.array([]),
      contacts: this.formBuilder.array([]),
    });
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      let birthDate = null;

      if (data.birthDate !== null) {
        birthDate = zonedTimeToUtc(data.birthDate, getTimezone());
      }

      this.patchTypePerson(data.typePerson);

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        birthDate: birthDate,
        typePerson: this.keyValueTypePerson.getKeyByValue(data.typePerson),
        civilState: this.keyValueCivilState.getKeyByValue(data.civilState),
        statusClient: this.keyValueStatusModel.getKeyByValue(data.statusClient),
        statusProvider: this.keyValueStatusModel.getKeyByValue(data.statusProvider),
        statusPromoter: this.keyValueStatusModel.getKeyByValue(data.statusPromoter),
        statusEmployee: this.keyValueStatusModel.getKeyByValue(data.statusEmployee),
        statusTourGuide: this.keyValueStatusModel.getKeyByValue(data.statusTourGuide),
      });

      this.patchValueAgentTypes();
      this.onChangeAgentTypes(this.agentTypes.value);

      this.resourceForm.setControl('address', this.formBuilder.array(data.address || []));
      this.resourceForm.setControl('contacts', this.formBuilder.array(data.contacts || []));
    }
  }

  protected patchValueAgentTypes() {
    if (!this.objectIsEmpty(this.config.data.agentTypes)) {
      const typesAgents: Options.ModelString[] = [];

      this.config.data.agentTypes.forEach((type: { agentType: string; id: number }) => {
        switch (type.agentType) {
          case this.getValueKeyByEnum(TypeAgentEnum.Client): {
            typesAgents.push({
              label: TypeAgentEnum.Client,
              value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Client),
            });
            break;
          }

          case this.getValueKeyByEnum(TypeAgentEnum.Provider): {
            typesAgents.push({
              label: TypeAgentEnum.Provider,
              value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Provider),
            });
            break;
          }

          case this.getValueKeyByEnum(TypeAgentEnum.Promoter): {
            typesAgents.push({
              label: TypeAgentEnum.Promoter,
              value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Promoter),
            });
            break;
          }

          case this.getValueKeyByEnum(TypeAgentEnum.Employee): {
            typesAgents.push({
              label: TypeAgentEnum.Employee,
              value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Employee),
            });
            break;
          }

          case this.getValueKeyByEnum(TypeAgentEnum.Tour_Guide): {
            typesAgents.push({
              label: TypeAgentEnum.Tour_Guide,
              value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Tour_Guide),
            });
            break;
          }

          default: {
            break;
          }
        }
      });

      this.agentTypes.patchValue(typesAgents);
    }
  }

  protected patchTypePerson(type: string) {
    if (
      type === this.getKeyByValueEnum(TypePersonEnum, TypePersonEnum.Legal) ||
      type === this.keyValueTypePerson.getValue(this.getKeyByValueEnum(TypePersonEnum, TypePersonEnum.Legal))
    ) {
      this.document.clearValidators();
      this.document.reset();
      this.document.setValidators([Validators.required, CustomValidator.isValidCnpj()]);
      this.document.updateValueAndValidity();
      this.labelDocument = wsConsts.CNPJ;
      this.mask = wsConsts.MASK_CNPJ;
    } else {
      this.document.clearValidators();
      this.document.reset();
      this.document.setValidators([Validators.required, CustomValidator.isValidCpf()]);
      this.document.updateValueAndValidity();
      this.labelDocument = wsConsts.CPF;
      this.mask = wsConsts.MASK_CPF;
    }
  }

  protected setAgentTypes(agentType: string[]) {
    const typesAgents: Options.ModelString[] = [];

    if (!this.objectIsEmpty(agentType)) {
      if (agentType[0] === this.getValueKeyByEnum(TypeAgentEnum.Client)) {
        this.validClients();

        typesAgents.push({
          label: TypeAgentEnum.Client,
          value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Client),
        });
      } else {
        this.resetClients();
      }

      if (agentType[0] === this.getValueKeyByEnum(TypeAgentEnum.Provider)) {
        this.validProviders();
        typesAgents.push({
          label: TypeAgentEnum.Provider,
          value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Provider),
        });
      } else {
        this.resetProviders();
      }

      if (agentType[0] === this.getValueKeyByEnum(TypeAgentEnum.Promoter)) {
        this.validPromoters();
        typesAgents.push({
          label: TypeAgentEnum.Promoter,
          value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Promoter),
        });
      } else {
        this.resetPromoters();
      }

      if (agentType[0] === this.getValueKeyByEnum(TypeAgentEnum.Employee)) {
        this.validEmployees();
        typesAgents.push({
          label: TypeAgentEnum.Employee,
          value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Employee),
        });
      } else {
        this.resetEmployees();
      }

      if (agentType[0] === this.getValueKeyByEnum(TypeAgentEnum.Tour_Guide)) {
        this.validTourGuide();
        typesAgents.push({
          label: TypeAgentEnum.Tour_Guide,
          value: this.getKeyByValueEnum(TypeAgentEnum, TypeAgentEnum.Tour_Guide),
        });
      } else {
        this.resetTourGuide();
      }
    } else {
      this.activeIndex = 0;
      this.resetClients();
      this.resetProviders();
      this.resetPromoters();
      this.resetEmployees();
      this.resetTourGuide();
    }

    this.agentTypes.patchValue(typesAgents);
  }

  get rg(): FormControl {
    return this.resourceForm.get('rg') as FormControl;
  }

  get sex(): FormControl {
    return this.resourceForm.get('sex') as FormControl;
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get code(): FormControl {
    return this.resourceForm.get('code') as FormControl;
  }

  get isAttendant(): FormControl {
    return this.resourceForm.get('isAttendant') as FormControl;
  }

  get isManager(): FormControl {
    return this.resourceForm.get('isManager') as FormControl;
  }

  get socialReason(): FormControl {
    return this.resourceForm.get('socialReason') as FormControl;
  }

  get document(): FormControl {
    return this.resourceForm.get('document') as FormControl;
  }

  get birthDate(): FormControl {
    return this.resourceForm.get('birthDate') as FormControl;
  }

  get agentTypes(): FormControl {
    return this.resourceForm.get('agentTypes') as FormControl;
  }

  get typePerson(): FormControl {
    return this.resourceForm.get('typePerson') as FormControl;
  }

  get statusClient(): FormControl {
    return this.resourceForm.get('statusClient') as FormControl;
  }

  get statusProvider(): FormControl {
    return this.resourceForm.get('statusProvider') as FormControl;
  }

  get statusTourGuide(): FormControl {
    return this.resourceForm.get('statusTourGuide') as FormControl;
  }

  get statusPromoter(): FormControl {
    return this.resourceForm.get('statusPromoter') as FormControl;
  }

  get statusEmployee(): FormControl {
    return this.resourceForm.get('statusEmployee') as FormControl;
  }

  get civilState(): FormControl {
    return this.resourceForm.get('civilState') as FormControl;
  }

  get address(): FormArray {
    return this.resourceForm.get('address') as FormArray;
  }

  get contacts(): FormArray {
    return this.resourceForm.get('contacts') as FormArray;
  }
}
