import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Product } from '../../shared/utils/interfaces';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { StateManagementService } from '../../shared/services/state-management.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
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
      title: 'Action',
      compare: null,
      priority: false,
    },
  ];

  isAvailable(data: Product): boolean {
    return data.rating?.count > 0;
  }
}
