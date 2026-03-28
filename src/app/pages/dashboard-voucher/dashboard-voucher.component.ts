import { PercentPipe, CurrencyPipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as moment from 'moment';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { takeUntil } from 'rxjs';

import {
  KeyValueStatusVoucher,
  StatisticsFilter,
  StatusVoucherEnum,
  Voucher,
  ByStatusDTO,
  VouchersTopClientsDTO,
  VouchersTotalDTO,
} from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as statisticsActions from 'src/app/store/actions/statistics-voucher.actions';

@Component({
  selector: 'app-dashboard-voucher',
  templateUrl: './dashboard-voucher.component.html',
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
    CalendarModule,
    ButtonModule,
    PanelModule,
    TableModule,
    SharedModule,
    ChartModule,
    PercentPipe,
    CurrencyPipe,
  ],
})
export class DashboardVoucherComponent extends BaseResourceFormComponent<Voucher.Model> implements OnInit {
  data: any;
  options:
    | {
        plugins: {
          legend: {
            labels: {
              usePointStyle: boolean;
              color: string;
            };
          };
        };
      }
    | undefined;

  vouchersTotalDTO: VouchersTotalDTO = {
    client: 0,
    quantity: 0,
    totalPrice: 0,
    totalPriceFoods: 0,
    totalPriceTickets: 0,
  };
  topClients: VouchersTopClientsDTO[] = [];
  keyValueStatusVoucher = new KeyValueStatusVoucher();

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.dataSet();
    this.getTopClients();
    this.getTotalVouchers();
  }

  public submitForm() {
    let filter = {};
    if (this.period.value) {
      filter = {
        firstPeriod: moment(this.period.value[0], 'YYYY-MM-DD'),
        finalPeriod: moment(this.period.value[1], 'YYYY-MM-DD'),
      };
    }
    this.store.dispatch(statisticsActions.setFilterVouchers({ filter }));

    this.dataSet();
    this.getTopClients();
    this.getTotalVouchers();
  }

  public validNaN(value: number) {
    if (value) {
      return value;
    }
    return 0;
  }

  public override reset(): void {
    this.resourceForm.reset();

    this.store.dispatch(statisticsActions.setFilterVouchers({ filter: {} }));
    this.dataSet();
    this.getTopClients();
    this.getTotalVouchers();
  }

  protected toStatusVouchers(status: number) {
    if (
      status ===
      this.keyValueStatusVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Dealing))
    ) {
      return StatusVoucherEnum.Dealing;
    }

    if (
      status ===
      this.keyValueStatusVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Confirmed))
    ) {
      return StatusVoucherEnum.Confirmed;
    }

    if (
      status ===
      this.keyValueStatusVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Exchanged))
    ) {
      return StatusVoucherEnum.Exchanged;
    }

    if (
      status ===
      this.keyValueStatusVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Overdue))
    ) {
      return StatusVoucherEnum.Overdue;
    }

    if (
      status ===
      this.keyValueStatusVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Called_off))
    ) {
      return StatusVoucherEnum.Called_off;
    }

    if (
      status ===
      this.keyValueStatusVoucher.getValue(this.getKeyByValueEnum(StatusVoucherEnum, StatusVoucherEnum.Not_closed))
    ) {
      return StatusVoucherEnum.Not_closed;
    }

    return;
  }

  protected dataSet() {
    this.store.dispatch(statisticsActions.byStatus());

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.store
      .select('statisticsVouchersState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ byStatus }) => {
        if (!this.objectIsEmpty(byStatus)) {
          this.data = {
            labels: byStatus.map((status: ByStatusDTO) => this.toStatusVouchers(status.status)),
            datasets: [
              {
                data: byStatus.map((status: ByStatusDTO) => status.total),
                backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0066FF'],
                hoverBackgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0066FF'],
              },
            ],
          };

          this.options = {
            plugins: {
              legend: {
                labels: {
                  usePointStyle: true,
                  color: textColor,
                },
              },
            },
          };
        } else {
          this.data = {};
        }
      });
  }

  protected getTopClients() {
    this.store.dispatch(statisticsActions.topClients());

    this.store
      .select('statisticsVouchersState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ topClients }) => {
        this.topClients = topClients;
      });
  }

  protected getTotalVouchers() {
    this.store.dispatch(statisticsActions.totalVouchers());

    this.store
      .select('statisticsVouchersState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ vouchersTotalDTO }) => {
        this.vouchersTotalDTO = vouchersTotalDTO;
      });
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      period: [],
    });
  }

  get period(): FormControl {
    return this.resourceForm.get('period') as FormControl;
  }
}
