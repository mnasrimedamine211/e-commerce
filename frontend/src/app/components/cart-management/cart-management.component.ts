import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CartItem, CartProduct, Product } from '../../shared/utils/interfaces';
import { ProductService } from '../../core/services/product.service';
import { SelectProductsModalComponent } from '../../shared/components/select-products-modal/select-products-modal.component';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { products } from '../../shared/utils/utils';
import { CartService } from '../../core/services/cart.service';
import { StateManagementService } from '../../shared/services/state-management.service';

@Component({
  selector: 'app-cart-management',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzSelectModule,
    NzModalModule,
    SelectProductsModalComponent,
  ],
  templateUrl: './cart-management.component.html',
  styleUrls: ['./cart-management.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CartManagementComponent implements OnInit {
  updateModalVisible: boolean = false;
  confirmModal?: NzModalRef;
  selectedCartId: number | null = null;
  addedProduct: boolean = false;
  tableHeight: string = '';
  listOfColumn = [
    {
      title: 'Price',
      compare: (a: Product, b: Product) => a.price - b.price,
      priority: 1,
    },
    {
      title: 'Quantity',
      compare: null,
      priority: false,
    },

    {
      title: 'Actions',
      compare: null,
      priority: false,
    },
  ];

  constructor(
    public stateManagementService: StateManagementService,
    public cartService: CartService,
    public productService: ProductService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.stateManagementService.tableHeight$.subscribe((height) => {
      const headerHeight = 160;
      const availableHeight = height - headerHeight;
      this.tableHeight =
        availableHeight > 0 ? `${availableHeight}px` : `${600}px`;
    });
  }

  openModal(cartId: number, isAddedProduct: boolean): void {
    this.selectedCartId = cartId;
    this.addedProduct = isAddedProduct;
    this.updateModalVisible = true;
  }
  deleteModal(cart: CartItem) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete these cart?',
      nzContent: 'When clicked the OK button, the cart is deleted',
      nzOnOk: () => this.cartService.deleteCartById(cart).subscribe(),
    });
  }
}
