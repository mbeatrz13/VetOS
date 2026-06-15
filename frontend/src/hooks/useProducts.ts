import { useState, useEffect, useCallback } from 'react';
import { productService, ProductAPI, ProductPayload } from '../services/product.service';

export function useProducts() {
  const [products, setProducts] = useState<ProductAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.list(search);
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: ProductPayload) => {
    const created = await productService.create(data);
    setProducts(prev => [...prev, created]);
    return created;
  };

  const updateProduct = async (id: number, data: Partial<ProductPayload>) => {
    const updated = await productService.update(id, data);
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProduct = async (id: number) => {
    await productService.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
}
