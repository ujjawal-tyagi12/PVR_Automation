import { ApiHelper } from '@utils/ApiHelper';

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  status: string;
}

export class OrderApi {
  static async create(productId: string, quantity: number, token: string): Promise<Order> {
    return ApiHelper.post<Order>('/orders', { productId, quantity }, { Authorization: `Bearer ${token}` });
  }

  static async getById(id: string, token: string): Promise<Order> {
    return ApiHelper.get<Order>(`/orders/${id}`, { Authorization: `Bearer ${token}` });
  }
}
