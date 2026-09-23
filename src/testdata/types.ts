export interface User {
  username: string;
  password: string;
  role: 'admin' | 'standard';
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}
