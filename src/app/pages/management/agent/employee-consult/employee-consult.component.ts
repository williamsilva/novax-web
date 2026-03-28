import { TitleCasePipe } from '@angular/common';
import { Injector, ViewChild, Component, OnInit } from '@angular/core';

import { SelectItem, SharedModule } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { KeyValueTypePerson, TypePersonEnum, Agent, EventFilters, Options, User } from 'src/app/models';
import { AgentsComponent } from 'src/app/pages/management/agent/agents';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as agentsActions from 'src/app/store/actions/agents.actions';
import * as employeeActions from 'src/app/store/actions/employees.actions';
import * as usersActions from 'src/app/store/actions/users.actions';
import { MaskDocumentPipe } from '../../../../shared/mask-document.pipe';

@Component({
  selector: 'app-employee-consult',
  templateUrl: './employee-consult.component.html',
  styles: [],
  standalone: true,
  imports: [TableModule, SharedModule, MultiSelectModule, TooltipModule, MaskDocumentPipe, TitleCasePipe],
})
export class EmployeeComponent extends BaseResourceListComponent<Agent.Model> implements OnInit {
  users: Options.Options[] = [];
  typePersonEnum: SelectItem[] = [];
  keyValueTypePerson = new KeyValueTypePerson();

  @ViewChild('table') grid!: Table;

  protected agentsComponent: AgentsComponent;

  constructor(protected override injector: Injector) {
    super(injector);

    this.agentsComponent = this.injector.get(AgentsComponent);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllUsers();
    this.itemsPerPageDefault = 9;
    this.typePersonEnum = this.setEnumValues(TypePersonEnum);
  }

  public clearTable() {
    this.grid.reset();
    this.store.dispatch(agentsActions.searchAgent());
  }

  public override delete(payload: number) {
    this.store.dispatch(agentsActions.deleteAgent({ payload }));
  }

  public activateHandler(payload: number) {
    this.store.dispatch(employeeActions.activationEmployee({ payload }));
  }

  public inactivateHandler(payload: number) {
    this.store.dispatch(employeeActions.deactivateEmployee({ payload }));
  }

  public override editResource(payload: Agent.Model) {
    this.store.dispatch(agentsActions.isEditingAgent({ isEditing: true }));
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
    this.store.dispatch(agentsActions.setParamsAgents({ params }));
    this.store.dispatch(agentsActions.searchAgent());

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
    this.fileName = 'Funcionários';
    this.headPdf = [['Código', 'Cliente', 'Pessoa', 'Status', 'Documento']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].code,
        this.resources[i].name,
        this.setDescription.typePerson(this.resources[i].typePerson),
        this.setDescription.status(this.resources[i].statusEmployee),
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
      this.setDescription.status(this.resources[i].statusEmployee),
      this.resources[i].document,
    );
  }

  protected mountObject(code: number, client: string, typePerson: string, status: string, document: string) {
    return {
      Código: code,
      Cliente: client,
      Pessoa: typePerson,
      Status: status,
      Documento: document,
    };
  }
}
