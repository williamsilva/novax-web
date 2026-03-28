import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { zonedTimeToUtc } from 'date-fns-tz';
import { NgxMaskDirective } from 'ngx-mask';
import { MenuItem, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { takeUntil } from 'rxjs';

import {
  wsConsts,
  StatusEnum,
  TypePersonEnum,
  StatusVoucherEnum,
  KeyValueTypePerson,
  KeyValueStatusVoucher,
  Voucher,
  Options,
  Food,
  Ticket,
  Product,
  Promoter,
  TourGuide,
} from 'src/app/models';
import { VoucherService } from 'src/app/service';
import { CustomValidator, getTimezone } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as clientStore from 'src/app/store/actions/clients.actions';
import * as actionsPromoters from 'src/app/store/actions/promoters.actions';
import * as actionsTourGuide from 'src/app/store/actions/tour-guide.actions';
import * as actionsVouchers from 'src/app/store/actions/vouchers.actions';
import { ItemsFoodComponent } from '../../../shared/components/items-food/items-food.component';
import { ItemsVoucherComponent } from '../../../shared/components/items-voucher/items-voucher.component';
import { ErrorMsgComponent } from '../../../shared/error-msg/error-msg.component';
import { CancellationReasonComponent } from '../cancellation-reason';

@Component({
  providers: [DialogService],
  selector: 'app-voucher-create',
  templateUrl: './voucher-create.component.html',
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
    ReactiveFormsModule,
    TabViewModule,
    ErrorMsgComponent,
    DropdownModule,
    NgxMaskDirective,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    ItemsVoucherComponent,
    ItemsFoodComponent,
    InputTextareaModule,
    SplitButtonModule,
    ButtonModule,
  ],
})
export class VoucherCreateComponent extends BaseResourceFormComponent<Voucher.Model> implements OnInit {
  activeIndex: number = 0;
  typePersonEnum: SelectItem[] = [];
  itemsSplitButton: MenuItem[] = [];
  promoters: Options.Dropdown[] = [];
  tourGuides: Options.Dropdown[] = [];
  StatusVoucherEnum = StatusVoucherEnum;
  statusVouchers: Options.TypeEnum[] = [];
  keyValueTypePerson = new KeyValueTypePerson();
  keyValueStatusVoucher = new KeyValueStatusVoucher();

  mask: string = wsConsts.MASK_CNPJ;
  labelDocument: string = wsConsts.CPF;

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
    protected voucherService: VoucherService,
    protected refCancellation: DynamicDialogRef,
    protected dialogServiceCancellation: DialogService,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.searchAllPromoters();
    this.searchAllTourGuide();
    this.setItemsSplitButton();
    this.mask = wsConsts.MASK_CPF;
    this.typePersonEnum = this.setEnumValues(TypePersonEnum);
    this.statusVouchers = this.setEnumValues(StatusVoucherEnum);

    this.store
      .select('voucherState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(actionsVouchers.createVoucher({ payload: this.toVoucherModel() }));
      } else {
        const uuid = this.config.data.uuid;
        this.store.dispatch(actionsVouchers.updateVoucher({ uuid, payload: this.toVoucherModel() }));
      }

      this.store
        .select('voucherState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ isLoading, success }) => {
          this.loading = isLoading;
          if (success) {
            this.reset();
          }
        });
    } else {
      this.activeIndex = 0;
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  public override reset(): void {
    this.ref.close();
  }

  public findByDocument() {
    if (this.documentClient.valid && this.documentClient.value !== null) {
      const document = this.documentClient.value;

      this.store.dispatch(clientStore.setDocument({ document }));
      this.store.dispatch(clientStore.searchClient());

      this.store
        .select('clientState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ client }) => {
          if (client.id != 0) {
            this.nameClient.setValue(client.name);
            this.clientId.setValue(client.id);
            this.documentClient.clearValidators();
            this.documentClient.updateValueAndValidity();
          } else {
            this.documentClient.setErrors({ noData: true });
            this.nameClient.setValue(null);
            this.clientId.setValue(null);
          }
        });
    }
  }

  public onChangeTypePerson(event: DropdownChangeEvent) {
    this.patchTypePerson(event.value);
  }

  public setItemsSplitButton() {
    this.itemsSplitButton = [
      {
        label: 'Confirma',
        icon: 'pi pi-search-plus',
        command: () => this.updateVoucher(StatusVoucherEnum.Confirmed),
        disabled: this.isDisabled([
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Dealing),
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Overdue),
        ]),
      },
      {
        label: 'Não Confirma',
        icon: 'pi pi-search-minus',
        command: () => this.updateVoucher(StatusVoucherEnum.Not_closed),
        disabled: this.isDisabled([
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Dealing),
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Overdue),
        ]),
      },
      {
        label: 'Trocar',
        icon: 'pi pi-check',
        command: () => this.updateVoucher(StatusVoucherEnum.Exchanged),
        disabled: this.isDisabled([
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Overdue),
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Confirmed),
        ]),
      },
      {
        label: 'Cancelar',
        icon: 'pi pi-times',
        command: () => this.openDialogCancellationReason(this.uuid.value),
        disabled: this.isDisabled([
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Dealing),
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Overdue),
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Confirmed),
        ]),
      },
      {
        label: wsConsts.VIEW,
        icon: 'fa fa-fw fa-search',
        command: () => this.updateVoucher(wsConsts.VIEW),
        disabled: this.isDisabled([
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Overdue),
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Confirmed),
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Exchanged),
          this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Not_closed),
        ]),
      },
      {
        label: wsConsts.SEND,
        icon: 'fa fa-fw fa-envelope',
        command: () => this.updateVoucher(wsConsts.SEND),
        disabled: this.isDisabled([this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Confirmed)]),
      },
    ];
  }

  public setStatusVouchers(status: StatusVoucherEnum) {
    this.status.setValue(this.getKeyByValueEnum(StatusVoucherEnum, status));
  }

  protected openDialogCancellationReason(voucher: string) {
    this.refCancellation = this.dialogServiceCancellation.open(CancellationReasonComponent, {
      width: '30%',
      data: voucher,
      baseZIndex: 1000,
      closeOnEscape: false,
      header: 'Cancelamento',
    });
  }

  protected patchTypePerson(type: string) {
    if (type === this.getKeyByValueEnum(TypePersonEnum, TypePersonEnum.Legal)) {
      this.documentClient.clearValidators();
      this.documentClient.reset();
      this.documentClient.setValidators([Validators.required, CustomValidator.isValidCnpj()]);
      this.documentClient.updateValueAndValidity();
      this.labelDocument = wsConsts.CNPJ;
      this.mask = wsConsts.MASK_CNPJ;
    } else {
      this.documentClient.clearValidators();
      this.documentClient.reset();
      this.documentClient.setValidators([Validators.required, CustomValidator.isValidCpf()]);
      this.documentClient.updateValueAndValidity();
      this.labelDocument = wsConsts.CPF;
      this.mask = wsConsts.MASK_CPF;
    }
  }

  protected patchValue() {
    const data = this.config.data;
    if (data) {
      let visitDate = null;

      if (data.visitDate !== null) {
        visitDate = zonedTimeToUtc(data.visitDate, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        visitDate,
        status: this.keyValueStatusVoucher.getKeyByValue(data.status),
        typePerson: this.keyValueTypePerson.getKeyByValue(data.typePerson),
      });
      this.resourceForm.setControl('foods', this.formBuilder.array(data.foods || []));
      this.resourceForm.setControl('tickets', this.formBuilder.array(data.tickets || []));
    }
  }

  protected toVoucherModel() {
    const { tourGuide, ...formValues } = this.resourceForm.value; // Remove tourGuide ao espalhar os outros valores

    const voucherDTO: Voucher.Input = {
      ...formValues,
      client: { id: this.clientId.value },
      promoter: { id: this.promoterId.value },
      foods: this.toFoodsModel(this.foods.value),
      tickets: this.toTicketModel(this.tickets.value),
      status: this.keyValueStatusVoucher.getValue(this.status.value),
      typePerson: this.keyValueTypePerson.getValue(this.typePerson.value),
      ...(this.tourGuideId.value ? { tourGuide: { id: this.tourGuideId.value } } : {}),
    };

    return voucherDTO;
  }

  protected toTicketModel(obj: Ticket.Model[]) {
    const ticketDTO: Ticket.Input[] = [];
    if (obj) {
      obj.forEach((t: Ticket.Model) => {
        ticketDTO.push({
          quantity: t.quantity,
          unitPrice: t.unitPrice,
          product: this.toProductModel(t.product),
        });
      });
    }

    return ticketDTO;
  }

  protected toFoodsModel(obj: Food.Model[]) {
    const foodDTO: Food.Input[] = [];
    if (obj) {
      obj.forEach((t: Food.Model) => {
        foodDTO.push({
          quantity: t.quantity,
          unitPrice: t.unitPrice,
          product: this.toProductModel(t.product),
        });
      });
    }

    return foodDTO;
  }

  protected toProductModel(obj: Product.Minimal) {
    const productDTO: { id: number } = {
      id: obj.id,
    };

    return productDTO;
  }

  protected searchAllPromoters() {
    this.store.dispatch(actionsPromoters.searchPromoter());

    this.store
      .select('promoterState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ promoter }) => {
        if (!this.objectIsEmpty(promoter)) {
          const data = promoter.sort((a: Promoter.Model, b: Promoter.Model) => {
            // Primeiro, comparamos o status
            if (a.statusPromoter < b.statusPromoter) {
              return -1; // a deve vir antes de b
            } else if (a.statusPromoter > b.statusPromoter) {
              return 1; // b deve vir antes de a
            } else {
              // Se os status forem iguais, comparamos os nomes
              return a.name < b.name ? -1 : 1;
            }
          });
          this.promoters = data.map((m: Promoter.Model) => ({
            id: m.id,
            name: m.name,
            inactive: m.statusPromoter === this.getValueKeyStatusByEnum(StatusEnum.Active) ? false : true,
          }));
        }
      });
  }

  protected searchAllTourGuide() {
    this.store.dispatch(actionsTourGuide.searchTourGuides());

    this.store
      .select('tourGuideState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ tourGuide }) => {
        if (!this.objectIsEmpty(tourGuide)) {
          const data = tourGuide.sort((a: TourGuide.Model, b: TourGuide.Model) => {
            // Primeiro, comparamos o status
            if (a.statusTourGuide < b.statusTourGuide) {
              return -1; // a deve vir antes de b
            } else if (a.statusTourGuide > b.statusTourGuide) {
              return 1; // b deve vir antes de a
            } else {
              // Se os status forem iguais, comparamos os nomes
              return a.name < b.name ? -1 : 1;
            }
          });
          this.tourGuides = data.map((m: TourGuide.Model) => ({
            id: m.id,
            name: m.name,
            inactive: m.statusTourGuide === this.getValueKeyStatusByEnum(StatusEnum.Active) ? false : true,
          }));
        }
      });
  }

  protected buildResourceForm(): void {
    const type = this.getKeyByValueEnum(TypePersonEnum, TypePersonEnum.Physical);
    const status = this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Dealing);

    this.resourceForm = this.formBuilder.group({
      uuid: [null],
      note: [null],
      voucher: [null],
      priceTotal: [0],
      status: [status],
      typePerson: type,
      advanceValue: [null],
      visitDate: [null, [Validators.required]],
      client: this.formBuilder.group({
        name: [],
        id: [null, [Validators.required]],
        document: ['', [Validators.required]],
      }),
      promoter: this.formBuilder.group({
        name: [],
        document: [],
        id: [null, [Validators.required]],
      }),
      tourGuide: this.formBuilder.group({
        name: [],
        document: [],
        id: [null],
      }),

      foods: this.formBuilder.array([]),
      tickets: this.formBuilder.array([]),
    });
  }

  protected isDisabled(status: string[]): boolean {
    if (this.auth.hasAnyPermission([this.wsPermissions.ROLE_VOUCHERS_CHANGE]) && this.blockedStatus(status)) {
      return false;
    } else {
      return true;
    }
  }

  protected blockedStatus(status: string[]): boolean {
    if (this.isEditing) {
      for (const role of status) {
        if (this.status.value === role) {
          return true;
        }
      }
    }
    return false;
  }

  protected updateVoucher(status: string) {
    const payload = this.uuid.value;

    if (status === StatusVoucherEnum.Not_closed) {
      this.store.dispatch(actionsVouchers.notConfirmVoucher({ payload }));

      this.store
        .select('voucherState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ notConfirmed }) => {
          if (notConfirmed) {
            this.setStatusVouchers(StatusVoucherEnum.Not_closed);
          }
        });
    }

    if (status === StatusVoucherEnum.Confirmed) {
      this.store.dispatch(actionsVouchers.confirmVoucher({ payload }));

      this.store
        .select('voucherState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ confirmed }) => {
          if (confirmed) {
            this.setStatusVouchers(StatusVoucherEnum.Confirmed);
          }
        });
    }

    if (status === StatusVoucherEnum.Exchanged) {
      this.store.dispatch(actionsVouchers.changeVoucher({ payload }));

      this.store
        .select('voucherState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ changed }) => {
          if (changed) {
            this.setStatusVouchers(StatusVoucherEnum.Exchanged);
          }
        });
    }

    if (status === wsConsts.VIEW) {
      this.voucherService.toView(this.uuid.value).subscribe(
        (report: Blob) => {
          const url = window.URL.createObjectURL(report);
          window.open(url);
        },
        (error) => this.errorHandler.handle(error),
      );
    }

    if (status === wsConsts.SEND) {
      this.store.dispatch(actionsVouchers.toSendVoucher({ payload }));
    }
  }

  get uuid(): FormControl {
    return this.resourceForm.get('uuid') as FormControl;
  }

  get note(): FormControl {
    return this.resourceForm.get('note') as FormControl;
  }

  get tourGuideId(): FormControl {
    return this.resourceForm.get('tourGuide.id') as FormControl;
  }

  get promoterId(): FormControl {
    return this.resourceForm.get('promoter.id') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get visitDate(): FormControl {
    return this.resourceForm.get('visitDate') as FormControl;
  }

  get voucher(): FormControl {
    return this.resourceForm.get('voucher') as FormControl;
  }

  get typePerson(): FormControl {
    return this.resourceForm.get('typePerson') as FormControl;
  }

  get advanceValue(): FormControl {
    return this.resourceForm.get('advanceValue') as FormControl;
  }

  get nameClient(): FormControl {
    return this.resourceForm.get('client.name') as FormControl;
  }

  get clientId(): FormControl {
    return this.resourceForm.get('client.id') as FormControl;
  }

  get documentClient(): FormControl {
    return this.resourceForm.get('client.document') as FormControl;
  }

  get tickets(): FormArray {
    return this.resourceForm.get('tickets') as FormArray;
  }

  get foods(): FormArray {
    return this.resourceForm.get('foods') as FormArray;
  }
}
