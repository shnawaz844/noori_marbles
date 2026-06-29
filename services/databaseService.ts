import { supabase } from './supabaseClient';
import { Product, Order, EnquiryData, Category } from '../types';

export const databaseService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data as Category[];
  },

  async addCategory(category: Category) {
    const { error } = await supabase
      .from('categories')
      .insert([category]);

    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data as Product[];
  },

  async seedProducts(products: Product[]) {
    const { error } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'id' });

    if (error) {
      console.error('Error seeding products:', error);
      throw error;
    }
  },

  async addProduct(product: Product) {
    const { error } = await supabase
      .from('products')
      .insert([product]);

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(product: Product) {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', product.id);

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async updateProductQuantity(id: string, quantity: number) {
    const { error } = await supabase
      .from('products')
      .update({ quantity })
      .eq('id', id);

    if (error) {
      console.error('Error updating product quantity:', error);
      throw error;
    }
  },

  // Orders
  async createOrder(order: Order) {
    const { data, error } = await supabase
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
      .select();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    return data[0];
  },

  async getOrders(): Promise<any[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data;
  },

  async getUserOrders(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
    return data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Enquiries
  async saveEnquiry(enquiry: EnquiryData) {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([enquiry])
      .select();

    if (error) {
      console.error('Error saving enquiry:', error);
      throw error;
    }
    return data[0];
  },

  async getEnquiries(): Promise<any[]> {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enquiries:', error);
      return [];
    }
    return data;
  }
};
