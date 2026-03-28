import { Directive, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SelectItem, PrimeNGConfig, MessageService, FilterMatchMode, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';

import { AuthService } from 'src/app/auth';
import { wsConsts, StatusEnum, wsPermissions, KeyValueStatus, EventFilters } from 'src/app/models';
import { HasClassStyle, SetDescription } from 'src/app/shared';
import * as store from 'src/app/store';

@Directive()
export abstract class BaseResourceListComponent<T> implements OnInit, OnDestroy {
  public auth: AuthService;
  public headPdf: any[] = [];
  public dataPdf: any[] = [];
  public dataXLSX: any[] = [];
  public wsConsts = wsConsts;
  public fileName: string = '';
  public resources: T[] = [];
  public pageDefault: number = 0;
  public lastRecords: number = 0;
  public StatusEnum = StatusEnum;
  public loading: boolean = false;
  public firstRecords: number = 0;
  public totalRecords: number = 0;
  public selectionSingleTable!: T;
  public dataSelectedXLSX: any[] = [];
  public statusEnum: SelectItem[] = [];
  public wsPermissions = wsPermissions;
  public itemsPerPageDefault: number = 0;
  public resourceForm = new FormGroup({});
  public selectionMultipleTable: T[] = [];
  public hasClassStyle = new HasClassStyle();
  public keyValueStatus = new KeyValueStatus();
  public setDescription = new SetDescription();
  public rowsPerPageOptions: number[] = [5, 7, 11, 30, 50, 100, 1000];

  protected primConfig: PrimeNGConfig;
  protected store: Store<store.AppState>;
  protected destroy$ = new Subject<void>();
  protected messageService: MessageService;
  protected confirmation: ConfirmationService;

  constructor(protected injector: Injector) {
    this.store = this.injector.get(Store);
    this.auth = this.injector.get(AuthService);
    this.primConfig = this.injector.get(PrimeNGConfig);
    this.messageService = this.injector.get(MessageService);
    this.confirmation = this.injector.get(ConfirmationService);
  }

  ngOnInit(): void {
    this.statusEnum = this.setEnumValues(StatusEnum);

    this.itemsPerPageDefault = 11;
  }

  public ngOnDestroy() {
    this.unsubscribe();
  }

  public whenSwitchingPage(params: any) {
    const page = parseInt(JSON.stringify(params.first)) / parseInt(JSON.stringify(params.rows));

    this.itemsPerPageDefault = params.rows || 5;
    this.pageDefault = page;

    this.search(params);
  }

  public currentPageReportTemplate() {
    if (this.resources.length > 0) {
      return `Exibindo ${this.firstRecords} á ${this.lastRecords} de ${this.totalRecords} registros`;
    }
    return '';
  }

  public clear(table: Table) {
    table.clear();
  }

  public deleteResource(resource: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?. Esta ação é irreversível',
      accept: async () => {
        this.delete(resource);
      },
    });
  }

  public editResource(resource: any) {
    this.messageService.add({ severity: 'warn', detail: 'Necessary implementation of the editResource method!' });
  }

  public getValueKeyStatusByEnum(key: any): string {
    return this.keyValueStatus.getValue(this.getKeyByValueEnum(StatusEnum, key));
  }

  public onRowSelect(event: any) {
    this.toSelectedXLSX();
  }

  public onRowUnselect(event: any) {
    this.toSelectedXLSX();
  }

  public exportExcelSelectionOnly() {
    if (this.objectIsEmpty(this.selectionMultipleTable)) {
      this.messageService.add({ severity: 'warn', detail: 'Não a dados para ser exibido!' });
    } else {
      this.xlsx(this.dataSelectedXLSX);
    }
  }

  public exportExcel() {
    if (this.objectIsEmpty(this.resources)) {
      this.messageService.add({ severity: 'warn', detail: 'Não a dados para ser exibido!' });
    } else {
      this.xlsx(this.dataXLSX);
    }
  }

  public exportPdf() {
    if (this.objectIsEmpty(this.resources)) {
      this.messageService.add({ severity: 'warn', detail: 'Não a dados para ser exibido!' });
    } else {
      const doc = new jsPDF('l', 'mm', 'a4');
      const head = this.headPdf;

      autoTable(doc, {
        head: head,
        body: this.dataPdf,
        didDrawCell: (data) => {},
      });
      doc.save(this.fileName + '.pdf');
    }
  }

  protected toSelectedXLSX() {}

  protected xlsx(data: any) {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, this.fileName + '_export_' + new Date().getTime());
    });
  }

  protected saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  protected getKeyByValueEnum(enumObj: any, value: any): string {
    for (const key in enumObj) {
      if (enumObj[key] === value) {
        return key;
      }
    }
    return '';
  }

  protected formatDataPtBR(date: Date) {
    //if (date === null) {
    // return;
    //}
    //const parsedDate = parseISO(date);
    return date;
  }

  protected formatValuePtBR(value: any) {
    if (value === null) {
      value = 0;
    }
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  protected openNew() {
    this.messageService.add({ severity: 'warn', detail: 'Necessary implementation of the openNew method!' });
  }

  protected delete(payload: any) {
    this.messageService.add({ severity: 'warn', detail: 'Necessary implementation of the delete method!' });
  }

  protected search(params: EventFilters) {
    this.messageService.add({ severity: 'warn', detail: 'Necessary implementation of the search method!' });
  }

  protected setEnumValues<T>(enumType: any): { label: string; value: keyof T }[] {
    const enumValues: { label: string; value: keyof T }[] = [];

    for (const key in enumType) {
      if (enumType.hasOwnProperty(key)) {
        enumValues.push({
          label: enumType[key as keyof T],
          value: key as keyof T,
        });
      }
    }

    return enumValues;
  }

  protected hasStatus(entry: string, status: string[]): boolean {
    for (const role of status) {
      if (entry === role) {
        return true;
      }
    }

    return false;
  }

  protected unsubscribe() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected setPagesDate(data: any) {
    if (data && data !== null && data.totalElements > 0) {
      this.totalRecords = data.totalElements;
      this.pageDefault = data.number;
      this.firstRecords = this.pageDefault === 0 ? 1 : this.pageDefault * data.size + 1;
      this.lastRecords =
        this.pageDefault + 1 === data.totalPages ? data.totalElements : (this.pageDefault + 1) * data.size;
    } else {
      this.lastRecords = 0;
      this.firstRecords = 0;
      this.totalRecords = 0;
    }
  }

  protected matchModeOptions() {
    this.primConfig.filterMatchModeOptions = {
      text: [
        FilterMatchMode.CONTAINS,
        FilterMatchMode.STARTS_WITH,
        FilterMatchMode.NOT_CONTAINS,
        FilterMatchMode.ENDS_WITH,
        FilterMatchMode.EQUALS,
        FilterMatchMode.NOT_EQUALS,
      ],
      numeric: [
        FilterMatchMode.CONTAINS,
        FilterMatchMode.NOT_CONTAINS,
        FilterMatchMode.EQUALS,
        FilterMatchMode.NOT_EQUALS,
        FilterMatchMode.LESS_THAN,
        FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
        FilterMatchMode.GREATER_THAN,
        FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
      ],
      date: [
        FilterMatchMode.DATE_IS,
        FilterMatchMode.DATE_IS_NOT,
        FilterMatchMode.DATE_BEFORE,
        FilterMatchMode.DATE_AFTER,
      ],
    };
  }

  protected objectIsEmpty(obj: any): boolean {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  protected compareElements(a: any, b: any) {
    return a - b;
  }
}
