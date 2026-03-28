import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { CancellationReason, EventFilters, wsConsts, wsPermissions } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as actionsReason from 'src/app/store/actions/cancellation-reason.actions';
import { CancellationReasonCreateComponent } from '../cancellation-reason-create';

@Component({
  providers: [DialogService],
  selector: 'app-cancellation-reason-consult',
  templateUrl: './cancellation-reason-consult.component.html',
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
export class CancellationReasonConsultComponent
  extends BaseResourceListComponent<CancellationReason.Model>
  implements OnInit
{
  refReason!: DynamicDialogRef;

  constructor(protected override injector: Injector, protected dialogServiceReason: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public override openNew() {
    this.store.dispatch(actionsReason.isEditingReason({ isEditing: false }));
    this.openDialogReason();
  }

  public override editResource(payload: CancellationReason.Model) {
    this.store.dispatch(actionsReason.isEditingReason({ isEditing: true }));
    this.openDialogReason(payload);
  }

  public disabledEdit(entry: CancellationReason.Model) {
    if (entry.generation === wsConsts.SYSTEM_GENERATION) {
      return true;
    }

    if (!this.auth.hasAnyPermission([wsPermissions.ROLE_CANCELLATION_REASON_CHANGE])) {
      return true;
    }

    return false;
  }

  protected override delete(payload: number) {
    this.store.dispatch(actionsReason.deleteReason({ payload }));
  }

  protected openDialogReason(reason?: CancellationReason.Model) {
    this.refReason = this.dialogServiceReason.open(CancellationReasonCreateComponent, {
      width: '55%',
      data: reason,
      baseZIndex: 1000,
      closeOnEscape: false,
      header: 'Motivo Cancelamento',
    });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(actionsReason.setParamsReasons({ params }));
    this.store.dispatch(actionsReason.searchReason());

    this.store
      .select('cancellationReasonState')
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
    this.fileName = 'Motivo';
    this.headPdf = [['Nome', 'Descrição', 'Status']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].name,
        this.resources[i].description,
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
      this.resources[i].name,
      this.resources[i].description,
      this.setDescription.equipment(this.resources[i].status),
    );
  }

  protected mountObject(name: string, description: string, status: string) {
    return {
      Nome: name,
      Descrição: description,
      Status: status,
    };
  }
}
