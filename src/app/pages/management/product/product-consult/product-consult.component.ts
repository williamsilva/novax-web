import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';

import { SelectItem, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';
import { EventFilters, KeyValueTypeProduct, Options, Product, TypeProductEnum, User } from 'src/app/models';
import { BaseResourceListComponent } from 'src/app/shared/components';
import * as productsActions from 'src/app/store/actions/products.actions';
import * as usersActions from 'src/app/store/actions/users.actions';
import { ProductCreateComponent } from '../product-create';

@Component({
  providers: [DialogService],
  selector: 'app-product-consult',
  templateUrl: './product-consult.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [
    PanelModule,
    TableModule,
    SharedModule,
    ButtonModule,
    TooltipModule,
    MultiSelectModule,
    CurrencyPipe,
    DatePipe,
  ],
})
export class ProductConsultComponent extends BaseResourceListComponent<Product.Model> implements OnInit {
  users: User.Minimal[] = [];
  refProduct!: DynamicDialogRef;
  typeProductEnum: SelectItem[] = [];
  selectedProductType!: Options.ModelString;
  keyValueTypeProduct = new KeyValueTypeProduct();

  constructor(protected override injector: Injector, protected dialogServiceProduct: DialogService) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.searchAllUsers();
    this.typeProductEnum = this.setEnumValues(TypeProductEnum);
    this.selectedProductType = {
      label: TypeProductEnum.Food,
      value: this.getKeyByValueEnum(TypeProductEnum, TypeProductEnum.Food),
    };

    this.store.dispatch(
      productsActions.setTypeProduct({ typeProduct: this.getKeyByValueEnum(TypeProductEnum, TypeProductEnum.Food) }),
    );
  }

  public override openNew() {
    this.store.dispatch(productsActions.isEditingProduct({ isEditing: false }));
    this.openDialogProduct();
  }

  public override editResource(payload: Product.Model) {
    this.store.dispatch(productsActions.isEditingProduct({ isEditing: true }));
    this.openDialogProduct(payload);
  }

  public onRowSelectMenu(event: TableRowSelectEvent) {
    this.store.dispatch(productsActions.setTypeProduct({ typeProduct: event.data.value }));
    this.store.dispatch(productsActions.loadProduct());
  }

  public activateHandler(payload: number) {
    this.store.dispatch(productsActions.activationProduct({ payload }));
  }

  public inactivateHandler(payload: number) {
    this.store.dispatch(productsActions.deactivateProduct({ payload }));
  }

  protected toDataPdf() {
    this.fileName = 'Produtos';
    this.headPdf = [['Nome', 'Validade Inicial', 'Validade Final', 'Valor', 'Status']];

    for (let i = 0; i < this.resources.length; i++) {
      this.dataPdf.push([
        this.resources[i].name,
        this.formatDataPtBR(this.resources[i].initialValidate),
        this.formatDataPtBR(this.resources[i].finalValidate),
        this.formatValuePtBR(this.resources[i].amount),
        this.setDescription.status(this.resources[i].status),
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
      this.formatDataPtBR(this.resources[i].initialValidate),
      this.formatDataPtBR(this.resources[i].finalValidate),
      this.formatValuePtBR(this.resources[i].amount),
      this.setDescription.status(this.resources[i].status),
    );
  }

  protected mountObject(name: string, initialValidate: Date, finalValidate: Date, amount: number, status: string) {
    return {
      Nome: name,
      Validade_Inicial: initialValidate,
      Validade_Final: finalValidate,
      Visita: amount,
      Valor: amount,
      Status: status,
    };
  }

  protected openDialogProduct(product?: Product.Model) {
    this.refProduct = this.dialogServiceProduct.open(ProductCreateComponent, {
      width: '55%',
      data: product,
      baseZIndex: 1000,
      header: 'Produto',
      closeOnEscape: false,
    });
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
    this.store.dispatch(productsActions.setParamsProducts({ params }));
    this.store.dispatch(productsActions.loadProduct());

    this.store
      .select('productState')
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

  protected override delete(payload: number) {
    this.store.dispatch(productsActions.deleteProduct({ payload }));
  }
}
