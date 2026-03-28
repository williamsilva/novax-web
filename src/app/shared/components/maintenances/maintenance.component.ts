
import { NgClass, TitleCasePipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injector, Input } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { MasterBaseDetailComponent } from '../base-resource-form/master-base-detail-component';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance.component.html',
    standalone: true,
    imports: [
        TableModule,
        SharedModule,
        NgClass,
        ToolbarModule,
        InputTextModule,
        TitleCasePipe,
        CurrencyPipe,
        DatePipe,
    ],
})
export class MaintenanceComponent extends MasterBaseDetailComponent<any> {
  @Input() totalMaintenance: any;

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.buildResourceForm();
  }

  protected override buildResourceForm(): void {}
}
