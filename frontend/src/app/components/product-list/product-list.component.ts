import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CartItem, CartProduct, Product } from '../../shared/utils/interfaces';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { StateManagementService } from '../../shared/services/state-management.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

import {
  generateUniqueId,
  getRandomInt,
} from '../../shared/utils/helperMethods';
import { CartService } from '../../core/services/cart.service';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    FormsModule,
    NzInputModule,
    AddProductModalComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductListComponent {
  modalVisible: boolean = false;

  constructor(
    public productService: ProductService,
    public stateManagementService: StateManagementService,
    public cartService: CartService
  ) {}

  listOfColumn = [
    {
      title: 'Title',
      compare: null,
      priority: false,
    },
    {
      title: 'Price',
      compare: (a: Product, b: Product) => a.price - b.price,
      priority: 1,
    },
    {
      title: 'Category',
      compare: null,
      priority: false,
    },
    {
      title: 'Availability Status',
      compare: null,
      priority: false,
    },
    {
      title: 'Actions',
      compare: null,
      priority: false,
    },
  ];

  addCart(product: Product) {
    const cart: CartItem = {
      id: generateUniqueId(this.cartService.rawCartList),
      date: new Date().toDateString(),
      products: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
      userId: getRandomInt(1, 100),
    };
    this.cartService.addCart(cart).subscribe();
  }

  openModal() {
    this.modalVisible = true;
  }

  onSubmit(product: any) {
    this.productService.addProduct(product).subscribe(() => {
      this.cartService.createNotification(
        'Product added ',
        product.title + ' added to the list'
      );
    });
  }
}
