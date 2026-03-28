import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { zonedTimeToUtc } from 'date-fns-tz';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs';
import { KeyValueTypeProduct, Product, StatusEnum, TypeProductEnum } from 'src/app/models';
import { getTimezone, CustomValidator } from 'src/app/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components';
import * as productsActions from 'src/app/store/actions/products.actions';
import { ErrorMsgComponent } from '../../../../shared/error-msg/error-msg.component';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styles: [
    `
      ::ng-deep .p-datepicker table td {
        padding: 0rem 0rem 0 0rem !important;
      }
    `,
  ],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ErrorMsgComponent,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
  ],
})
export class ProductCreateComponent extends BaseResourceFormComponent<Product.Model> implements OnInit {
  requiredAmount = true;
  keyValueTypeProduct = new KeyValueTypeProduct();

  constructor(
    protected ref: DynamicDialogRef,
    protected override injector: Injector,
    protected config: DynamicDialogConfig,
  ) {
    super(injector);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.store
      .select('productState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isEditing }) => {
        this.isEditing = isEditing;
      });

    this.patchValue();
  }

  public submitForm(): void {
    if (this.resourceForm.valid) {
      if (!this.isEditing) {
        this.store.dispatch(productsActions.createProduct({ payload: this.toProductModel() }));
      } else {
        const id = this.config.data.id;
        this.store.dispatch(productsActions.updateProduct({ id, payload: this.toProductModel() }));
      }

      this.store
        .select('productState')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ isLoading, success }) => {
          this.loading = isLoading;
          if (success) {
            this.reset();
          }
        });
    } else {
      this.error.checkFormValidations(this.resourceForm);
    }
  }

  public override reset(): void {
    this.ref.close();
  }

  public onChange() {
    if (!this.description.value) {
      this.description.patchValue(this.name.value);
    }
  }

  protected patchValue() {
    this.getTypeProduct();
    const data = this.config.data;
    if (data) {
      let finalValidate = null;
      let initialValidate = null;

      if (data.initialValidate !== null) {
        initialValidate = zonedTimeToUtc(data.initialValidate, getTimezone());
      }

      if (data.finalValidate !== null) {
        finalValidate = zonedTimeToUtc(data.finalValidate, getTimezone());
      }

      this.resourceForm.patchValue(data);
      this.resourceForm.patchValue({
        finalValidate,
        initialValidate,
        status: this.keyValueStatus.getKeyByValue(data.status),
      });
    }
  }

  protected toProductModel() {
    const productDTO: Product.Input = {
      ...this.resourceForm.value,
      amount: this.amount.value || 0,
      status: this.keyValueStatusModel.getValue(this.status.value),
      typeProduct: this.keyValueTypeProduct.getValue(this.getTypeProduct()),
    };
    return productDTO;
  }

  protected buildResourceForm(): void {
    const initialValidate = new FormControl();
    const status = this.getKeyByValueEnum(StatusEnum, StatusEnum.Active);
    const finalValidate = new FormControl(null, [CustomValidator.validDate(initialValidate)]);

    this.resourceForm = this.formBuilder.group({
      amount: [null],
      finalValidate: finalValidate,
      initialValidate: initialValidate,
      status: [status, Validators.required],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          CustomValidator.endsWithSpace(),
          CustomValidator.startsWithSpace(),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          CustomValidator.endsWithSpace(),
          CustomValidator.startsWithSpace(),
        ],
      ],
    });
  }

  protected getTypeProduct(): string {
    let typeProducts: string = '';

    this.store
      .select('productState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ typeProduct }) => {
        typeProducts = typeProduct;
      });
    this.validAmount(typeProducts);
    return typeProducts;
  }

  protected validAmount(type: string) {
    const typeProduct = this.getKeyByValueEnum(TypeProductEnum, TypeProductEnum.Courtesy);
    if (type === typeProduct) {
      this.requiredAmount = false;
      this.amount.disable();
      this.amount.reset();
    } else {
      this.requiredAmount = true;
      this.amount.enable();
      this.amount.setValidators([Validators.required]);
    }
  }

  get finalValidate(): FormControl {
    return this.resourceForm.get('finalValidate') as FormControl;
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get initialValidate(): FormControl {
    return this.resourceForm.get('initialValidate') as FormControl;
  }

  get amount(): FormControl {
    return this.resourceForm.get('amount') as FormControl;
  }

  get status(): FormControl {
    return this.resourceForm.get('status') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }
}
