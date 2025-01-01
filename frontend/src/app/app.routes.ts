import { Routes } from '@angular/router';
import { productResolver } from './core/resolver/product.resolver';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartManagementComponent } from './components/cart-management/cart-management.component';
import { cartResolver } from './core/resolver/cart.resolver';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { carts: cartResolver, products: productResolver },
    children: [
      {
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'carts',
        component: CartManagementComponent,
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
];
