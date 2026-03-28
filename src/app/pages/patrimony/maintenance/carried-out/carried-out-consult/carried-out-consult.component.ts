import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SelectItem, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import {
  TypeMaintenanceEnum,
  StatusMaintenanceEnum,
  KeyValueTypeMaintenance,
  KeyValueStatusMaintenance,
  Maintenance,
  EventFilters,
} from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as maintenanceStore from 'src/app/store/actions/maintenance.actions';
import { CarriedOutCreateComponent } from '../carried-out-create/carried-out-create.component';

@Component({
  providers: [DialogService],
  selector: 'app-carried-out-consult',
  templateUrl: './carried-out-consult.component.html',
  styles: [],
  standalone: true,
  imports: [TableModule, SharedModule, ButtonModule, TooltipModule, MultiSelectModule, CurrencyPipe, DatePipe],
})
export class CarriedOutConsultComponent extends BaseResourceListComponent<Maintenance.Model> implements OnInit {
  refMaintenance!: DynamicDialogRef;
  typeMaintenanceEnum: SelectItem[] = [];
  statusMaintenanceEnum: SelectItem[] = [];
  keyValueTypePerson = new KeyValueTypeMaintenance();
  keyValueTypeMaintenance = new KeyValueTypeMaintenance();
  keyValueStatusMaintenance = new KeyValueStatusMaintenance();

  constructor(protected override injector: Injector, protected dialogServiceMaintenance: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.typeMaintenanceEnum = this.setEnumValues(TypeMaintenanceEnum);
    this.statusMaintenanceEnum = this.setEnumValues(StatusMaintenanceEnum);
  }

  public override openNew() {
    this.store.dispatch(maintenanceStore.isEditingMaintenance({ isEditing: false }));
    this.openDialogMaintenance();
  }

  public override editResource(payload: Maintenance.Model) {
    this.store.dispatch(maintenanceStore.isEditingMaintenance({ isEditing: true }));
    this.openDialogMaintenance(payload);
  }

  protected override delete(payload: number) {
    this.store.dispatch(maintenanceStore.deleteMaintenance({ payload }));
  }

  protected openDialogMaintenance(maintenance?: Maintenance.Model) {
    this.refMaintenance = this.dialogServiceMaintenance.open(CarriedOutCreateComponent, {
      width: '55%',
      baseZIndex: 1000,
      data: maintenance,
      header: 'Manutenção',
      closeOnEscape: false,
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(maintenanceStore.setParamsMaintenances({ params }));
    this.store.dispatch(maintenanceStore.searchMaintenance());

    this.store
      .select('maintenanceState')
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
    this.fileName = 'Manutenções';
    this.headPdf = [['Patrimonio', 'Equipamento', 'Envio', 'Retorno', 'Valor', 'Status', 'Tipo']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].equipment.patrimonyNumber,
        this.resources[i].equipment.description,
        this.formatDataPtBR(this.resources[i].sendDate),
        this.formatDataPtBR(this.resources[i].returnDate),
        this.formatValuePtBR(this.resources[i].price),
        this.setDescription.statusMaintenance(this.resources[i].status),
        this.setDescription.typeMaintenance(this.resources[i].typeMaintenance),
      ]);
    }
  }

  protected dataToXLSX(i: number) {
    return this.mountObject(
      this.resources[i].equipment.patrimonyNumber,
      this.resources[i].equipment.description,
      this.formatDataPtBR(this.resources[i].sendDate),
      this.formatDataPtBR(this.resources[i].returnDate),
      this.formatValuePtBR(this.resources[i].price),
      this.setDescription.statusMaintenance(this.resources[i].status),
      this.setDescription.typeMaintenance(this.resources[i].typeMaintenance),
    );
  }

  protected mountObject(
    patrimony: number,
    equipment: string,
    sendDate: Date,
    returnDate: Date,
    price: number,
    status: string,
    type: string,
  ) {
    return {
      Patrimonio: patrimony,
      Equipamento: equipment,
      Envio: sendDate,
      Retorno: returnDate,
      Valor: price,
      Status: status,
      Tipo: type,
    };
  }
}
