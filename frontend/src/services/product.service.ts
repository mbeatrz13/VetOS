import { apiRequest } from './api';

export interface ProductAPI {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minimum_stock: number;
  unit: string;
  expiry_date?: string | null;
  unit_price: number;
}

export interface ProductPayload {
  name: string;
  category: string;
  quantity: number;
  minimum_stock: number;
  unit: string;
  expiry_date?: string;
  unit_price: number;
}

export const productService = {
  list(search?: string) {
    const params = search ? { search } : undefined;
    return apiRequest<ProductAPI[]>('/inventory/products/', { params });
  },

  getById(id: number) {
    return apiRequest<ProductAPI>(`/inventory/products/${id}/`);
  },

  create(data: ProductPayload) {
    return apiRequest<ProductAPI>('/inventory/products/', { method: 'POST', body: data });
  },

  update(id: number, data: Partial<ProductPayload>) {
    return apiRequest<ProductAPI>(`/inventory/products/${id}/`, { method: 'PATCH', body: data });
  },

  delete(id: number) {
    return apiRequest<void>(`/inventory/products/${id}/`, { method: 'DELETE' });
  },
};
