import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SelectItem, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { Equipment, EventFilters, KeyValueEquipment, StatusEquipmentEnum } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as actionsEquipment from 'src/app/store/actions/equipment.actions';
import { EquipmentCreateComponent } from '../equipment-create';

@Component({
  providers: [DialogService],
  selector: 'app-equipment-consult',
  templateUrl: './equipment-consult.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [TableModule, SharedModule, ButtonModule, TooltipModule, MultiSelectModule, CurrencyPipe, DatePipe],
})
export class EquipmentConsultComponent extends BaseResourceListComponent<Equipment.Model> implements OnInit {
  refEquipment!: DynamicDialogRef;
  statusEquipmentEnum: SelectItem[] = [];
  keyValueModel = new KeyValueEquipment();
  StatusEquipmentEnum = StatusEquipmentEnum;

  constructor(protected override injector: Injector, protected dialogServiceEquipment: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.statusEquipmentEnum = this.setEnumValues(StatusEquipmentEnum);
  }

  public override openNew() {
    this.store.dispatch(actionsEquipment.isEditingEquipment({ isEditing: false }));
    this.openDialogEquipment();
  }

  public override editResource(payload: Equipment.Model) {
    this.store.dispatch(actionsEquipment.isEditingEquipment({ isEditing: true }));
    this.openDialogEquipment(payload);
  }

  protected override delete(payload: number) {
    this.store.dispatch(actionsEquipment.deleteEquipment({ payload }));
  }

  protected openDialogEquipment(equipment?: Equipment.Model) {
    this.refEquipment = this.dialogServiceEquipment.open(EquipmentCreateComponent, {
      width: '55%',
      data: equipment,
      baseZIndex: 1000,
      closeOnEscape: false,
      header: 'Equipamento',
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(actionsEquipment.setParamsEquipments({ params }));
    this.store.dispatch(actionsEquipment.searchEquipment());

    this.store
      .select('equipmentState')
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

  protected toDataPdf() {
    this.dataPdf = [];
    this.fileName = 'Equipamentos';
    this.headPdf = [['Patrimonio', 'Equipamento', 'Compra', 'Valor', 'Status']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].patrimonyNumber,
        this.resources[i].description,
        this.formatDataPtBR(this.resources[i].buyDate),
        this.formatValuePtBR(this.resources[i].price),
        this.setDescription.equipment(this.resources[i].status),
      ]);
    }
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

  protected dataToXLSX(i: number) {
    return this.mountObject(
      this.resources[i].patrimonyNumber,
      this.resources[i].description,
      this.formatDataPtBR(this.resources[i].buyDate),
      this.formatValuePtBR(this.resources[i].price),
      this.setDescription.equipment(this.resources[i].status),
    );
  }

  protected mountObject(patrimony: number, description: string, buyDate: Date, price: number, status: string) {
    return {
      Patrimonio: patrimony,
      Equipamento: description,
      Compra: buyDate,
      Valor: price,
      Status: status,
    };
  }
}
