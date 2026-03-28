import { TitleCasePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { SelectItem, SharedModule } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { Agent, EventFilters, KeyValueTypePerson, Options, TypePersonEnum, User } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as agentActions from 'src/app/store/actions/agents.actions';
import * as usersActions from 'src/app/store/actions/users.actions';
import { MaskDocumentPipe } from '../../../../shared/mask-document.pipe';
import { AgentsComponent } from '../agents/agents.component';

@Component({
  selector: 'app-agent-consult',
  templateUrl: './agent-consult.component.html',
  styles: [],
  standalone: true,
  imports: [TableModule, SharedModule, MultiSelectModule, TooltipModule, MaskDocumentPipe, TitleCasePipe],
})
export class AgentConsultComponent extends BaseResourceListComponent<Agent.Model> implements OnInit {
  users: Options.Options[] = [];
  typePersonEnum: SelectItem[] = [];
  keyValueTypePerson = new KeyValueTypePerson();

  @ViewChild('table') grid!: Table;

  constructor(protected override injector: Injector, protected agentsComponent: AgentsComponent) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllUsers();
    this.itemsPerPageDefault = 9;
    this.typePersonEnum = this.setEnumValues(TypePersonEnum);
  }

  public clearTable() {
    this.grid.reset();
    this.store.dispatch(agentActions.searchAgent());
  }

  public override delete(payload: number) {
    this.store.dispatch(agentActions.deleteAgent({ payload }));
  }

  public override editResource(payload: Agent.Model) {
    this.store.dispatch(agentActions.isEditingAgent({ isEditing: true }));
    this.agentsComponent.openDialogAgent(payload);
  }

  protected searchAllUsers() {
    this.store.dispatch(usersActions.searchAllUsers());

    this.store
      .select('userState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ allUsers, isLoading }) => {
        if (!this.objectIsEmpty(allUsers)) {
          this.users = allUsers.sort((a: User.Minimal, b: User.Minimal) => {
            return a.name < b.name ? -1 : 1;
          });
        }
        this.loading = isLoading;
      });
  }

  protected override search(params: EventFilters) {
    this.store.dispatch(agentActions.setParamsAgents({ params }));
    this.store.dispatch(agentActions.searchAgent());

    this.store
      .select('agentState')
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
    this.fileName = 'Agentes';
    this.headPdf = [['Código', 'Cliente', 'Pessoa', 'Documento']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].code,
        this.resources[i].name,
        this.setDescription.typePerson(this.resources[i].typePerson),
        this.resources[i].document,
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
      this.resources[i].code,
      this.resources[i].name,
      this.setDescription.typePerson(this.resources[i].typePerson),
      this.resources[i].document,
    );
  }

  protected mountObject(code: number, client: string, typePerson: string, document: string) {
    return {
      Código: code,
      Cliente: client,
      Pessoa: typePerson,
      Documento: document,
    };
  }
}
