import { CurrencyPipe } from '@angular/common';
import { Component, Input, Injector } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';

import { Item } from 'src/app/models';
import * as productState from 'src/app/store/actions/products.actions';

import { ErrorMsgComponent } from '../../error-msg/error-msg.component';
import { BaseResourceFormComponent } from '../base-resource-form';

@Component({
    selector: 'app-items-food',
    templateUrl: './items-food.component.html',
    styles: [],
    standalone: true,
    imports: [
        TableModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ErrorMsgComponent,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        TooltipModule,
        ToolbarModule,
        CurrencyPipe,
    ],
})
export class ItemsFoodComponent extends BaseResourceFormComponent<any> {
  @Input() foods: Array<any> = [];

  totalValue = 0;
  valueProductAdd = 0;
  foodsIndex: number = 0;

  products: any[] = [];

  constructor(protected override injector: Injector) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.buildResourceForm();
    this.searchProducts();
  }

  public submitForm(): void {}

  public addItems() {
    if (this.resourceForm.valid) {
      this.unitPrice.setValue(this.valueProductAdd);
      const resource = this.resourceForm.value;

      const array = this.foods.filter(
        (data: any) => data.product.id === resource.product.id && data.product.amount === resource.product.amount
      );

      if (array.length >= 2) {
        let quantity = 0;
        const index: any[] = [];

        array.forEach((item: any) => {
          quantity = quantity + item.quantity;
          index.push(item);
        });

        index.forEach((i) => {
          if (i.id !== index[0].id) {
            this.removeItem(this.foods.indexOf(i));
          }
        });

        array[0].quantity = quantity + resource.quantity;
      } else if (array.length === 1) {
        const food = array[0];
        food.quantity = food.quantity + resource.quantity;
      } else {
        this.foods[this.foodsIndex] = this.cloneItems(resource);
      }

      this.resourceForm.reset();
      this.valueProductAdd = 0;
      this.calculateTotal();
    } else {
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  public onFocusProduct() {
    this.toPrepareNew();
  }

  public onChangeProduct(event: any) {
    this.valueProductAdd = event.value.amount;
  }

  public removeItem(index: number) {
    this.foods.splice(index, 1);
    this.calculateTotal();
  }

  protected cloneItems(item: Item): Item {
    return new Item(item.id, item.totalPrice, item.unitPrice, item.quantity, item.product);
  }

  protected searchProducts(): void {
    this.store.dispatch(productState.loadFoodsProduct());

    this.store
      .select('productState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ food }) => {
        if (!this.objectIsEmpty(food)) {
          this.products = food.sort((a: any, b: any) => {
            return a.name < b.name ? -1 : 1;
          });
          this.products = this.products.map((m: any) => ({
            label: m.name,
            value: m,
          }));

          this.calculateTotal();
        }
      });
  }

  protected toPrepareNew() {
    if (!this.foods) {
      this.foods = this.formBuilder.array([]).value;
    }
    this.resourceForm.reset();
    this.foodsIndex = this.foods.length;
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      unitPrice: [null],
      totalPrice: [null],
      product: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
    });
  }

  protected calculateTotal() {
    if (this.foods && this.foods != null) {
      const totalItems = this.foods
        .map((i: any) => i.unitPrice * i.quantity)
        .reduce((totalPrice, v) => totalPrice + v, 0);
      this.totalValue = totalItems;
    }
  }

  get product(): FormControl {
    return this.resourceForm.get('product') as FormControl;
  }

  get quantity(): FormControl {
    return this.resourceForm.get('quantity') as FormControl;
  }

  get unitPrice(): FormControl {
    return this.resourceForm.get('unitPrice') as FormControl;
  }
}
