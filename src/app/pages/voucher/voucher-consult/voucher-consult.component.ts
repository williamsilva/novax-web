import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SelectItem, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { EventFilters, KeyValueStatusVoucher, StatusVoucherEnum, Voucher } from 'src/app/models';
import { Promoter } from 'src/app/models/Promoter';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as promoterStore from 'src/app/store/actions/promoters.actions';
import * as voucherStore from 'src/app/store/actions/vouchers.actions';
import * as actionsVouchers from 'src/app/store/actions/vouchers.actions';
import { VoucherCreateComponent } from '../voucher-create';

@Component({
  selector: 'app-voucher',
  providers: [DialogService],
  templateUrl: './voucher-consult.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0.05rem 0.05rem 0 0.05rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [DatePipe, TableModule, SharedModule, CurrencyPipe, ButtonModule, TooltipModule, MultiSelectModule],
})
export class VoucherConsultComponent extends BaseResourceListComponent<Voucher.Model> implements OnInit {
  refVoucher!: DynamicDialogRef;
  promoters: Promoter.Model[] = [];
  statusVoucherEnum: SelectItem[] = [];
  keyValueStatusVoucher = new KeyValueStatusVoucher();

  constructor(protected override injector: Injector, protected dialogServiceVoucher: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.statusVoucherEnum = this.setEnumValues(StatusVoucherEnum);
    this.searchAllPromoters();
  }

  public override openNew() {
    this.store.dispatch(voucherStore.isEditingVoucher({ isEditing: false }));
    this.openDialogVoucher();
  }

  public override editResource(payload: Voucher.Model) {
    this.store.dispatch(actionsVouchers.isEditingVoucher({ isEditing: true }));
    this.openDialogVoucher(payload);
  }

  public canCancel(status: string) {
    const dealing = this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Dealing);

    if (
      !this.auth.hasAnyPermission([this.wsPermissions.ROLE_VOUCHERS_DELETE]) ||
      !this.hasStatus(status, [this.keyValueStatusVoucher.getValue(dealing)])
    ) {
      return true;
    }
    return false;
  }

  protected override delete(payload: number) {
    this.store.dispatch(actionsVouchers.deleteVoucher({ payload }));
  }

  protected openDialogVoucher(voucher?: Voucher.Model) {
    this.refVoucher = this.dialogServiceVoucher.open(VoucherCreateComponent, {
      width: '55%',
      data: voucher,
      baseZIndex: 1000,
      header: 'Voucher',
      closeOnEscape: false,
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(voucherStore.setParamsVouchers({ params }));
    this.store.dispatch(voucherStore.searchVoucher());

    this.store
      .select('voucherState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, isLoading }) => {
        if (data.content) {
          this.resources = data.content;
          this.setPagesDate(data.page);

          this.toDataPdf();
          this.toDataXLSX();
        }
        this.loading = isLoading;
      });
  }

  protected searchAllPromoters() {
    this.store.dispatch(promoterStore.searchPromoter());

    this.store
      .select('promoterState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ promoter }) => {
        if (!this.objectIsEmpty(promoter)) {
          this.promoters = promoter.sort((a: Promoter.Model, b: Promoter.Model) => {
            return a.name < b.name ? -1 : 1;
          });
        }
      });
  }

  protected toDataXLSX() {
    this.dataXLSX = [];
    for (let i = 0; i < this.resources.length; i++) {
      this.dataXLSX.push(this.dataToXLSX(i));
    }
  }

  protected override toSelectedXLSX() {
    this.dataSelectedXLSX = [];
    for (let i = 0; i < this.selectionMultipleTable.length; i++) {
      this.dataSelectedXLSX.push(this.dataToXLSX(i));
    }
  }

  protected toDataPdf() {
    this.dataPdf = [];
    this.fileName = 'Vouchers';
    this.headPdf = [['Voucher', 'Cliente', 'Promotor', 'Visita', 'Valor', 'Status']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].voucher,
        this.resources[i].client.name,
        this.resources[i].promoter.name,
        this.formatDataPtBR(this.resources[i].visitDate),
        this.formatValuePtBR(this.resources[i].totalPrice),
        this.setDescription.voucher(this.resources[i].status),
      ]);
    }
  }

  protected dataToXLSX(i: number) {
    return this.mountObject(
      this.resources[i].voucher,
      this.resources[i].client.name,
      this.resources[i].promoter.name,
      this.formatDataPtBR(this.resources[i].visitDate),
      this.formatValuePtBR(this.resources[i].totalPrice),
      this.setDescription.voucher(this.resources[i].status),
    );
  }

  protected mountObject(voucher: string, client: string, promoter: string, visit: Date, valor: number, status: string) {
    return {
      Voucher: voucher,
      Cliente: client,
      Promotor: promoter,
      Visita: visit,
      Valor: valor,
      Status: status,
    };
  }
}
