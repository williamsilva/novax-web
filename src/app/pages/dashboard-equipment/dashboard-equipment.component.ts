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
  Equipment,
  EquipmentsTotalDTO,
  TopEquipmentsDTO,
  ByStatusDTO,
  StatusMaintenanceEnum,
  KeyValueStatusMaintenance,
  MaintenancesTotalDTO,
} from 'src/app/models';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as statisticsActions from 'src/app/store/actions/statistics-equipment.actions';

@Component({
  selector: 'app-dashboard-equipment',
  templateUrl: './dashboard-equipment.component.html',
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
export class DashboardEquipmentComponent extends BaseResourceFormComponent<Equipment.Model> implements OnInit {
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

  equipmentTotalDTO: EquipmentsTotalDTO = {
    equipmentTotal: 0,
    totalValue: 0,
  };

  maintenanceTotalDTO: MaintenancesTotalDTO = {
    maintenanceTotal: 0,
    totalMaintenance: 0,
    totalEquipmentsInMaintenance: 0,
  };

  topEquipments: TopEquipmentsDTO[] = [];
  keyValueStatusMaintenance = new KeyValueStatusMaintenance();

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.dataSet();
    this.getTopEquipments();
    this.getTotalEquipments();
    this.getTotalMaintenances();
  }

  protected getTotalMaintenances() {
    this.store.dispatch(statisticsActions.totalMaintenances());

    this.store
      .select('statisticsEquipmentsState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ maintenancesTotalDTO }) => {
        this.maintenanceTotalDTO = maintenancesTotalDTO;
      });
  }

  protected getTotalEquipments() {
    this.store.dispatch(statisticsActions.totalEquipments());

    this.store
      .select('statisticsEquipmentsState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ equipmentsTotalDTO }) => {
        this.equipmentTotalDTO = equipmentsTotalDTO;
      });
  }

  protected getTopEquipments() {
    this.store.dispatch(statisticsActions.topEquipments());

    this.store
      .select('statisticsEquipmentsState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ topEquipments }) => {
        this.topEquipments = topEquipments;
      });
  }

  protected dataSet() {
    this.store.dispatch(statisticsActions.byStatusEquipments());

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.store
      .select('statisticsEquipmentsState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ byStatus }) => {
        if (!this.objectIsEmpty(byStatus)) {
          this.data = {
            labels: byStatus.map((status: ByStatusDTO) => this.toStatusMaintenances(status.status)),
            datasets: [
              {
                data: byStatus.map((status: ByStatusDTO) => status.total),
                backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC'],
                hoverBackgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC'],
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

  protected toStatusMaintenances(status: number) {
    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Approved),
      )
    ) {
      return StatusMaintenanceEnum.Approved;
    }

    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Budget),
      )
    ) {
      return StatusMaintenanceEnum.Budget;
    }

    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Concerted),
      )
    ) {
      return StatusMaintenanceEnum.Concerted;
    }

    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Proposal),
      )
    ) {
      return StatusMaintenanceEnum.Proposal;
    }

    if (
      status ===
      this.keyValueStatusMaintenance.getValue(
        this.getKeyByValueEnum(StatusMaintenanceEnum, StatusMaintenanceEnum.Received),
      )
    ) {
      return StatusMaintenanceEnum.Received;
    }

    return;
  }

  public submitForm() {
    let filter = {};
    if (this.period.value) {
      filter = {
        firstPeriod: moment(this.period.value[0], 'YYYY-MM-DD'),
        finalPeriod: moment(this.period.value[1], 'YYYY-MM-DD'),
      };
    }

    this.store.dispatch(statisticsActions.setFilterStatisticsEquipments({ filter }));
    this.dataSet();
    this.getTopEquipments();
    this.getTotalEquipments();
    this.getTotalMaintenances();
  }

  public validNaN(value: number) {
    if (value) {
      return value;
    }
    return 0;
  }

  public override reset(): void {
    this.resourceForm.reset();

    this.store.dispatch(statisticsActions.setFilterStatisticsEquipments({ filter: {} }));
    this.dataSet();
    this.getTopEquipments();
    this.getTotalEquipments();
    this.getTotalMaintenances();
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
