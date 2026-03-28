import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { Agent, KeyValueTypeAgent, TypeAgentEnum } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as agentActions from 'src/app/store';
import { AgentConsultComponent } from '../agent-consult';
import { AgentCreateComponent } from '../agent-create';
import { ClientComponent } from '../client-consult';
import { EmployeeComponent } from '../employee-consult';
import { PromoterComponent } from '../promoter-consult';
import { ProviderComponent } from '../provider-consult';
import { TourGuideConsultComponent } from '../tour-guide-consult';

@Component({
  selector: 'app-agents',
  providers: [DialogService],
  templateUrl: './agents.component.html',
  styles: [],
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule,
    TabViewModule,
    AgentConsultComponent,
    ClientComponent,
    ProviderComponent,
    PromoterComponent,
    EmployeeComponent,
    TourGuideConsultComponent,
  ],
})
export class AgentsComponent extends BaseResourceListComponent<Agent.Model> implements OnInit {
  refAgent!: DynamicDialogRef;
  TypeAgentEnum = TypeAgentEnum;
  agentType: string | undefined = undefined;
  keyValueTypeAgent = new KeyValueTypeAgent();

  @ViewChild(ClientComponent)
  private clientComponent!: ClientComponent;

  @ViewChild(ProviderComponent)
  private providerComponent!: ProviderComponent;

  @ViewChild(PromoterComponent)
  private promoterComponent!: PromoterComponent;

  @ViewChild(EmployeeComponent)
  private employeeComponent!: EmployeeComponent;

  @ViewChild(AgentConsultComponent)
  private agentConsultComponent!: AgentConsultComponent;

  @ViewChild(TourGuideConsultComponent)
  private tourGuideConsultComponent!: TourGuideConsultComponent;

  constructor(protected override injector: Injector, protected dialogServiceAgent: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.store.dispatch(agentActions.setAgentType({ agentType: [] }));

    this.store
      .select('agentState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ agentType }) => {
        this.agentType = agentType[0];
      });
  }

  public getValueKeyByEnum(key: string): string {
    return this.keyValueTypeAgent.getValue(this.getKeyByValueEnum(TypeAgentEnum, key));
  }

  public override openNew() {
    this.store.dispatch(agentActions.isEditingAgent({ isEditing: false }));
    this.openDialogAgent();
  }

  public onChangeAgents(event: { index: number }): void {
    switch (event.index) {
      case 0: {
        this.store.dispatch(agentActions.setAgentType({ agentType: [] }));
        break;
      }

      case 1: {
        this.store.dispatch(agentActions.setAgentType({ agentType: [this.getValueKeyByEnum(TypeAgentEnum.Client)] }));
        break;
      }

      case 2: {
        this.store.dispatch(agentActions.setAgentType({ agentType: [this.getValueKeyByEnum(TypeAgentEnum.Promoter)] }));
        break;
      }

      case 3: {
        this.store.dispatch(agentActions.setAgentType({ agentType: [this.getValueKeyByEnum(TypeAgentEnum.Provider)] }));
        break;
      }

      case 4: {
        this.store.dispatch(agentActions.setAgentType({ agentType: [this.getValueKeyByEnum(TypeAgentEnum.Employee)] }));
        break;
      }

      case 5: {
        this.store.dispatch(
          agentActions.setAgentType({ agentType: [this.getValueKeyByEnum(TypeAgentEnum.Tour_Guide)] }),
        );
        break;
      }

      default: {
        this.store.dispatch(agentActions.setAgentType({ agentType: [] }));
        break;
      }
    }
  }

  public override clear() {
    switch (this.agentType) {
      case this.getValueKeyByEnum(TypeAgentEnum.Client): {
        this.clientComponent.clearTable();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Provider): {
        this.providerComponent.clearTable();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Promoter): {
        this.promoterComponent.clearTable();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Employee): {
        this.employeeComponent.clearTable();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Tour_Guide): {
        this.tourGuideConsultComponent.clearTable();
        break;
      }

      default: {
        this.agentConsultComponent.clearTable();
      }
    }
  }

  public override exportExcel() {
    switch (this.agentType) {
      case this.getValueKeyByEnum(TypeAgentEnum.Client): {
        this.clientComponent.exportExcel();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Provider): {
        this.providerComponent.exportExcel();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Promoter): {
        this.promoterComponent.exportExcel();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Employee): {
        this.employeeComponent.exportExcel();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Tour_Guide): {
        this.tourGuideConsultComponent.exportExcel();
        break;
      }

      default: {
        this.agentConsultComponent.exportExcel();
      }
    }
  }

  public override exportPdf() {
    switch (this.agentType) {
      case this.getValueKeyByEnum(TypeAgentEnum.Client): {
        this.clientComponent.exportPdf();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Provider): {
        this.providerComponent.exportPdf();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Promoter): {
        this.promoterComponent.exportPdf();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Employee): {
        this.employeeComponent.exportPdf();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Tour_Guide): {
        this.tourGuideConsultComponent.exportPdf();
        break;
      }

      default: {
        this.agentConsultComponent.exportPdf();
      }
    }
  }

  public override exportExcelSelectionOnly() {
    switch (this.agentType) {
      case this.getValueKeyByEnum(TypeAgentEnum.Client): {
        this.clientComponent.exportExcelSelectionOnly();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Provider): {
        this.providerComponent.exportExcelSelectionOnly();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Promoter): {
        this.promoterComponent.exportExcelSelectionOnly();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Employee): {
        this.employeeComponent.exportExcelSelectionOnly();
        break;
      }

      case this.getValueKeyByEnum(TypeAgentEnum.Tour_Guide): {
        this.tourGuideConsultComponent.exportExcelSelectionOnly();
        break;
      }

      default: {
        this.agentConsultComponent.exportExcelSelectionOnly();
      }
    }
  }

  public openDialogAgent(agent?: Agent.Model) {
    this.refAgent = this.dialogServiceAgent.open(AgentCreateComponent, {
      data: agent,
      width: '55%',
      baseZIndex: 1000,
      header: 'Agentes',
      closeOnEscape: false,
    });
  }
}
