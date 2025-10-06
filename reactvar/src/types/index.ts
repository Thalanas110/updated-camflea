export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  phone?: string;
  profile_pic?: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  images: string[];
  seller_id: string;
  seller?: User;
  location?: string;
  created_at: string;
  updated_at: string;
  is_available: boolean;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  id: string;
  participants: User[];
  last_message?: Message;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<any>;
  signOut: () => Promise<void>;
}

export interface ItemFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  search?: string;
}