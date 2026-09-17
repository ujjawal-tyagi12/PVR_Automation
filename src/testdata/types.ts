export interface TestUser {
  username: string;
  password: string;
  role: 'admin' | 'standard';
}

export interface TestProduct {
  id: string;
  name: string;
  price: number;
}
