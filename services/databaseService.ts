import { supabase } from './supabaseClient';
import { Product, Order, EnquiryData, Category } from '../types';

const withTimeout = <T>(promise: PromiseLike<T>, ms = 2000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database request timed out')), ms)
    ),
  ]);
};

export const databaseService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await withTimeout(
        supabase.from('categories').select('*').order('name', { ascending: true }),
        2000
      );

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      return (data || []) as Category[];
    } catch (err) {
      console.error('Timeout or error fetching categories:', err);
      return [];
    }
  },

  async addCategory(category: Category) {
    const { error } = await withTimeout(
      supabase.from('categories').insert([category]),
      2000
    );

    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string) {
    const { error } = await withTimeout(
      supabase.from('categories').delete().eq('id', id),
      2000
    );

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await withTimeout(
        supabase.from('products').select('*').order('id', { ascending: true }),
        2000
      );

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      return (data || []) as Product[];
    } catch (err) {
      console.error('Timeout or error fetching products:', err);
      return [];
    }
  },

  async seedProducts(products: Product[]) {
    const { error } = await withTimeout(
      supabase.from('products').upsert(products, { onConflict: 'id' }),
      4000
    );

    if (error) {
      console.error('Error seeding products:', error);
      throw error;
    }
  },

  async addProduct(product: Product) {
    const { error } = await withTimeout(
      supabase.from('products').insert([product]),
      2000
    );

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(product: Product) {
    const { error } = await withTimeout(
      supabase.from('products').update(product).eq('id', product.id),
      2000
    );

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    const { error } = await withTimeout(
      supabase.from('products').delete().eq('id', id),
      2000
    );

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async updateProductQuantity(id: string, quantity: number) {
    const { error } = await withTimeout(
      supabase.from('products').update({ quantity }).eq('id', id),
      2000
    );

    if (error) {
      console.error('Error updating product quantity:', error);
      throw error;
    }
  },

  // Orders
  async createOrder(order: Order) {
    const { data, error } = await withTimeout(
      supabase
        .from('orders')
        .insert([{
          order_id: order.orderId,
          user_id: order.userId || null,
          items: order.items,
          customer_info: order.customerInfo,
          payment_method: order.paymentMethod,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total,
          status: order.status || 'Pending',
          created_at: order.createdAt
        }])
        .select(),
      3000
    );

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    return data?.[0];
  },

  async getOrders(): Promise<any[]> {
    try {
      const { data, error } = await withTimeout(
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        2000
      );

      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Timeout or error fetching orders:', err);
      return [];
    }
  },

  async getUserOrders(userId: string): Promise<any[]> {
    try {
      const { data, error } = await withTimeout(
        supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        2000
      );

      if (error) {
        console.error('Error fetching user orders:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Timeout or error fetching user orders:', err);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { error } = await withTimeout(
      supabase.from('orders').update({ status }).eq('id', orderId),
      2000
    );

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Enquiries
  async saveEnquiry(enquiry: EnquiryData) {
    const { data, error } = await withTimeout(
      supabase.from('enquiries').insert([enquiry]).select(),
      3000
    );

    if (error) {
      console.error('Error saving enquiry:', error);
      throw error;
    }
    return data?.[0];
  },

  async getEnquiries(): Promise<any[]> {
    try {
      const { data, error } = await withTimeout(
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
        2000
      );

      if (error) {
        console.error('Error fetching enquiries:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Timeout or error fetching enquiries:', err);
      return [];
    }
  }
};
