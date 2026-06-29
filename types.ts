
export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface Hotspot {
  productId: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  name?: string; // Optional manual name override
  price?: number; // Optional manual price override
  image?: string; // Optional manual image override
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  unit?: string; // e.g. "sqft", "piece", "box"
  originalPrice?: number;
  inStock?: boolean;
  quantity?: number;
  hotspots?: Hotspot[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export enum ProductCategory {
  TILES = 'Tiles & Marbles',
  PLY_BOARDS = 'Ply Boards',
  FURNITURE = 'Luxury Furniture',
  PVC_SHEETS = 'PVC & Wall Panels',
  SANITARY = 'Sanitary Wares',
  HARDWARE = 'Premium Hardware',
  DOORS = 'Designer Doors',
  TAPS = 'Luxury Faucets',
  LAMINATES = 'High-End Laminates'
}

export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'Card',
  WALLET = 'Wallet',
  COD = 'Cash on Delivery'
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  orderId: string;
  userId?: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
  createdAt: Date;
}

export interface EnquiryData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  created_at?: string;
}
