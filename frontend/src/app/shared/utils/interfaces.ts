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
  title: string;
  price: number;
  quantity: number;
}
