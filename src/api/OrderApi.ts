import type { APIRequestContext } from '@playwright/test';
import { ApiHelper } from '@utils/ApiHelper';
import type { Order } from '@testdata/types';

export class OrderApi {
  constructor(private request: APIRequestContext) {}

  async create(productId: string, quantity: number): Promise<Order> {
    return ApiHelper.postJson<Order>(this.request, '/orders', { productId, quantity });
  }

  async getById(orderId: string): Promise<Order> {
    return ApiHelper.getJson<Order>(this.request, `/orders/${orderId}`);
  }
}
