import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { MaskDocumentPipe } from 'src/app/shared';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as actionsCourtesy from 'src/app/store/actions/courtesy.actions';
import { CourtesyCreateComponent } from '../courtesy-create/courtesy-create.component';
import { CourtesyExchangedComponent } from '../courtesy-exchanged/courtesy-exchanged.component';
import { Courtesy, EventFilters, KeyValueStatusCourtesy, StatusCourtesyEnum } from 'src/app/models';

@Component({
  providers: [DialogService],
  selector: 'app-courtesy-consult',
  standalone: true,
  imports: [DatePipe, TableModule, CurrencyPipe, ButtonModule, TooltipModule, MaskDocumentPipe, MultiSelectModule],
  templateUrl: './courtesy-consult.component.html',
  styles: `
      ::ng-deep .p-datepicker table td {
        padding: 0.05rem 0.05rem 0 0.05rem !important;
      }
    `,
})
export class CourtesyConsultComponent extends BaseResourceListComponent<Courtesy.Model> implements OnInit {
  disabledPending = false;
  disabledNotPending = false;

  refCourtesy!: DynamicDialogRef;
  statusCourtesyEnum: SelectItem[] = [];
  refExchangedCourtesy!: DynamicDialogRef;
  StatusCourtesyEnum = StatusCourtesyEnum;
  keyValueStatusCourtesy = new KeyValueStatusCourtesy();

  constructor(protected override injector: Injector, protected dialogServiceCourtesy: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.statusCourtesyEnum = this.setEnumValues(StatusCourtesyEnum);
  }

  public override openNew() {
    this.store.dispatch(actionsCourtesy.isEditingCourtesy({ isEditing: false }));
    this.openDialogCourtesy();
  }

  public override editResource(payload: Courtesy.Model) {
    this.store.dispatch(actionsCourtesy.isEditingCourtesy({ isEditing: true }));
    this.openDialogCourtesy(payload);
  }

  public override delete(payload: number) {
    this.store.dispatch(actionsCourtesy.deleteCourtesy({ payload }));
  }

  public activeByStatus(courtesy: Courtesy.Model): boolean {
    return Boolean(
      courtesy.status === this.getValueStatusCourtesy(StatusCourtesyEnum.Canceled) ||
        courtesy.status === this.getValueStatusCourtesy(StatusCourtesyEnum.Exchanged),
    );
  }

  public canSelect(courtesy: Courtesy.Model): boolean {
    if (!this.selectionMultipleTable || !this.selectionMultipleTable.length) {
      return false;
    } else {
      if (this.selectionMultipleTable[0].status === this.getValueStatusCourtesy(StatusCourtesyEnum.Pending)) {
        this.disabledPending = false;
      } else {
        this.disabledPending = true;
      }

      return Boolean(this.selectionMultipleTable[0].status !== courtesy.status);
    }
  }

  public deactivateHandler(payload: string) {
    this.store.dispatch(actionsCourtesy.deactivateCourtesy({ payload }));
  }

  public activeHandler(payload: string) {
    this.store.dispatch(actionsCourtesy.activationCourtesy({ payload }));
  }

  public getValueStatusCourtesy(key: any): string {
    return this.keyValueStatusCourtesy.getValue(this.getKeyByValueEnum(StatusCourtesyEnum, key));
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(actionsCourtesy.setParamsCourtesy({ params }));
    this.store.dispatch(actionsCourtesy.searchCourtesy());

    this.store
      .select('courtesyState')
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

  protected openDialogExchanged() {
    this.refExchangedCourtesy = this.dialogServiceCourtesy.open(CourtesyExchangedComponent, {
      width: '35%',
      baseZIndex: 1000,
      header: 'Retirada',
      closeOnEscape: false,
      data: this.selectionMultipleTable,
    });

    this.selectionMultipleTable = [];
  }

  protected openDialogCourtesy(courtesy?: Courtesy.Model) {
    this.refCourtesy = this.dialogServiceCourtesy.open(CourtesyCreateComponent, {
      width: '55%',
      data: courtesy,
      baseZIndex: 1000,
      header: 'Cortesia',
      closeOnEscape: false,
    });
  }

  protected toDataPdf() {
    this.dataPdf = [];
    this.fileName = 'Cortesias';
    this.headPdf = [['Cliente', 'Autorizado', 'Retirada', 'Documento', 'Data', 'Visita', 'Status']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].client,
        this.resources[i].removedBy?.name,
        this.resources[i].authorizedBy?.name,
        this.resources[i].document,
        this.formatDataPtBR(this.resources[i].scheduledVisitDate),
        this.formatDataPtBR(this.resources[i].actualVisitDate),
        this.setDescription.courtesy(this.resources[i].status),
      ]);
    }
  }

  protected toDataXLSX() {
    this.dataXLSX = [];
    for (let i = 0; i < this.resources.length; i++) {
      this.dataXLSX.push(this.dataToXLSX(i));
    }
  }

  protected dataToXLSX(i: number) {
    return this.mountObject(
      this.resources[i].client,
      this.resources[i].removedBy?.name,
      this.resources[i].authorizedBy?.name,
      this.resources[i].document,
      this.formatDataPtBR(this.resources[i].scheduledVisitDate),
      this.formatDataPtBR(this.resources[i].actualVisitDate),
      this.setDescription.courtesy(this.resources[i].status),
    );
  }

  protected mountObject(
    nome: string,
    removedBy: string,
    authorizedBy: string,
    document: string,
    scheduledVisitDate: Date,
    actualVisitDate: Date,
    status: string,
  ) {
    return {
      Nome: nome,
      Autorizado: removedBy,
      Retirada: authorizedBy,
      Documento: document,
      Data: scheduledVisitDate,
      Visita: actualVisitDate,
      Status: status,
    };
  }
}
