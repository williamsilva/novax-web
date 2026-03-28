import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SelectItem, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import {
  wsConsts,
  StatusEnum,
  wsPermissions,
  KeyValueHistoric,
  StatusHistoricEnum,
  Historic,
  EventFilters,
} from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as actionsHistoric from 'src/app/store/actions/historic.actions';
import { HistoricCreateComponent } from '../historic-create';

@Component({
  providers: [DialogService],
  selector: 'app-historic-consult',
  templateUrl: './historic-consult.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [TableModule, SharedModule, ButtonModule, TooltipModule, MultiSelectModule, DatePipe],
})
export class HistoricConsultComponent extends BaseResourceListComponent<Historic.Model> implements OnInit {
  refHistoric!: DynamicDialogRef;
  statusHistoricEnum: SelectItem[] = [];

  keyValueHistoric = new KeyValueHistoric();

  constructor(protected override injector: Injector, protected dialogServiceHistoric: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.statusHistoricEnum = this.setEnumValues(StatusHistoricEnum);
  }

  public override openNew() {
    this.store.dispatch(actionsHistoric.isEditingHistoric({ isEditing: false }));
    this.openDialogHistoric();
  }

  public override editResource(payload: Historic.Model) {
    this.store.dispatch(actionsHistoric.isEditingHistoric({ isEditing: true }));
    this.openDialogHistoric(payload);
  }

  public disabledEdit(entry: Historic.Model) {
    if (entry.generation === wsConsts.SYSTEM_GENERATION) {
      const status = this.getKeyByValueEnum(StatusEnum, StatusEnum.Active);

      if (entry.status === this.keyValueStatus.getValue(status) && entry.location.description !== wsConsts.AUTHORIZED) {
        if (!this.auth.hasAnyPermission([wsPermissions.ROLE_HISTORIC_CHANGE])) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }

    if (!this.auth.hasAnyPermission([wsPermissions.ROLE_HISTORIC_CHANGE])) {
      return true;
    }

    return false;
  }

  protected override delete(payload: number) {
    this.store.dispatch(actionsHistoric.deleteHistoric({ payload }));
  }

  protected openDialogHistoric(historic?: Historic.Model) {
    this.refHistoric = this.dialogServiceHistoric.open(HistoricCreateComponent, {
      width: '55%',
      data: historic,
      baseZIndex: 1000,
      header: 'Histórico',
      closeOnEscape: false,
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(actionsHistoric.setParamsHistoric({ params }));
    this.store.dispatch(actionsHistoric.searchHistoric());

    this.store
      .select('historicState')
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
    this.fileName = 'Historico';
    this.headPdf = [['Patrimonio', 'Equipamento', 'Local', 'Chegada', 'Saida', 'Status']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].equipment.patrimonyNumber,
        this.resources[i].equipment.description,
        this.resources[i].location.description,
        this.formatDataPtBR(this.resources[i].initialDate),
        this.formatDataPtBR(this.resources[i].finalDate),
        this.setDescription.historic(this.resources[i].status),
      ]);
    }
  }

  protected dataToXLSX(i: number) {
    return this.mountObject(
      this.resources[i].equipment.patrimonyNumber,
      this.resources[i].equipment.description,
      this.resources[i].location.description,
      this.formatDataPtBR(this.resources[i].initialDate),
      this.formatDataPtBR(this.resources[i].finalDate),
      this.setDescription.historic(this.resources[i].status),
    );
  }

  protected mountObject(
    patrimony: number,
    equipment: string,
    location: string,
    initialDate: Date,
    finalDate: Date,
    status: string,
  ) {
    return {
      Patrimonio: patrimony,
      Equipamento: equipment,
      Local: location,
      Chegada: initialDate,
      Saida: finalDate,
      Status: status,
    };
  }
}
