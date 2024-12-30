import { Routes } from '@angular/router';
import { productResolver } from './core/resolver/product.resolver';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { products: productResolver },
  },
];
