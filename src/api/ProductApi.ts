import { ApiHelper } from '@utils/ApiHelper';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export class ProductApi {
  static async list(): Promise<Product[]> {
    return ApiHelper.get<Product[]>('/products');
  }

  static async getById(id: string): Promise<Product> {
    return ApiHelper.get<Product>(`/products/${id}`);
  }
}
