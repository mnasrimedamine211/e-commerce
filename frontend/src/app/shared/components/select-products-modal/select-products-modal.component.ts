import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../utils/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';

interface ModalData {
  products: Product[];
}

@Component({
  selector: 'select-products-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,

    NzButtonModule,
    NzIconModule,
    FormsModule,
    NzSelectModule,
  ],
  templateUrl: './select-products-modal.component.html',
  styleUrl: './select-products-modal.component.css',
})
export class SelectProductsModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() products: Product[] = [];
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitSelection: EventEmitter<number[]> = new EventEmitter<
    number[]
  >();

  selectedProducts: number[] = [];
  productOptions: any[] = [];
  constructor() {}
  ngOnInit(): void {
    this.products.map((product) => {
      this.productOptions.push({ label: product.title, value: product.id });
    });
  }

  handleOk(): void {
    this.submitSelection.emit(this.selectedProducts);
    this.closeModal.emit();
  }

  handleCancel(): void {
    this.closeModal.emit();
  }
}
