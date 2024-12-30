import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    NzMenuModule,
    NzIconModule,
    NzBadgeModule,
    NzButtonModule,
    NzDropDownModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavbarComponent {
  constructor(public cartService: CartService) {}
}
