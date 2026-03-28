
import { NgClass, TitleCasePipe, DatePipe } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { MasterBaseDetailComponent } from '../base-resource-form/master-base-detail-component';

@Component({
    selector: 'app-historical',
    templateUrl: './historical.component.html',
    standalone: true,
    imports: [
        TableModule,
        SharedModule,
        NgClass,
        TitleCasePipe,
        DatePipe,
    ],
})
export class HistoricalComponent extends MasterBaseDetailComponent<any> {
  constructor(protected override injector: Injector) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.buildResourceForm();
  }

  protected override buildResourceForm(): void {}
}
