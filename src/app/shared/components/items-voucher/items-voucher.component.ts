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
  selector: 'app-items-voucher',
  templateUrl: './items-voucher.component.html',
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
export class ItemsVoucherComponent extends BaseResourceFormComponent<any> {
  @Input() tickets: Array<any> = [];

  totalValue = 0;
  valueProductAdd = 0;
  ticketsIndex: number = 0;

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

      const array = this.tickets.filter(
        (data: any) => data.product.id === resource.product.id && data.product.amount === resource.product.amount,
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
            this.removeItem(this.tickets.indexOf(i));
          }
        });

        array[0].quantity = quantity + resource.quantity;
      } else if (array.length === 1) {
        const food = array[0];
        food.quantity = food.quantity + resource.quantity;
      } else {
        this.tickets[this.ticketsIndex] = this.cloneItems(resource);
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
    this.tickets.splice(index, 1);
    this.calculateTotal();
  }

  protected cloneItems(item: Item): Item {
    return new Item(item.id, item.totalPrice, item.unitPrice, item.quantity, item.product);
  }

  protected searchProducts(): void {
    this.store.dispatch(productState.loadTicketsProduct());

    this.store
      .select('productState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ ticket }) => {
        if (!this.objectIsEmpty(ticket)) {
          this.products = ticket.sort((a: any, b: any) => {
            return a.name < b.name ? -1 : 1;
          });
          this.products = this.products.map((m: any) => ({
            value: m,
            label: m.name,
          }));

          this.calculateTotal();
        }
      });
  }

  protected toPrepareNew() {
    if (!this.tickets) {
      this.tickets = this.formBuilder.array([]).value;
    }
    this.resourceForm.reset();
    this.ticketsIndex = this.tickets.length;
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
    if (this.tickets && this.tickets != null) {
      const totalItems = this.tickets
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
