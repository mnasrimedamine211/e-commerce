import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Product } from '../../shared/utils/interfaces';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ProductService } from '../../core/services/product.service';
import { generateUniqueId } from '../../shared/utils/helperMethods';
@Component({
  selector: 'add-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzTypographyModule,
    NzSelectModule,
  ],
  templateUrl: './add-product-modal.component.html',
  styleUrl: './add-product-modal.component.css',
})
export class AddProductModalComponent {
  @Input() isVisible: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitSelection: EventEmitter<Product | null> =
    new EventEmitter<Product | null>();
  productForm: FormGroup;
  constructor(public productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      title: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [null, [Validators.required]],
      category: [null, [Validators.required]],
      image: [null, [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      rate: [null, [Validators.min(0), Validators.max(5)]],
      count: [null, [Validators.min(0)]],
    });
  }

  handleCancel(): void {
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    if (this.productForm.valid) {
      const { title, price, description, category, image, rate, count } =
        this.productForm.value;
      const product: Product = {
        id: generateUniqueId(this.productService.rawProductList),
        title: title,
        price: price || 0,
        description: description,
        category: category,
        image: image,
        rating: {
          rate: rate || 0,
          count: count || 0,
        },
      };
      this.submitSelection.emit(product);
      this.closeModal.emit();

      this.productForm.reset();
    }
  }
}
