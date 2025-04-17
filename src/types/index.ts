
export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  price: number;
  description: string;
  categories: string[];
  rating: number;
  inStock: boolean;
  bestSeller?: boolean;
  newRelease?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  qrCodeData?: string;
}
