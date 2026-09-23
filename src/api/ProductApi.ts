import type { APIRequestContext } from '@playwright/test';
import { ApiHelper } from '@utils/ApiHelper';
import type { Product } from '@testdata/types';

export class ProductApi {
  constructor(private request: APIRequestContext) {}

  async list(): Promise<Product[]> {
    return ApiHelper.getJson<Product[]>(this.request, '/products');
  }

  async getById(productId: string): Promise<Product> {
    return ApiHelper.getJson<Product>(this.request, `/products/${productId}`);
  }
}
