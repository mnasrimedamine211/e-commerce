export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
export interface Rating {
  rate: number;
  count: number;
}

export interface CartItem {
  id: number;
  date: string;
  products: CartProduct[];
  userId: number;
}

export interface CartProduct {
  productId: number;
  quantity: number;
}
