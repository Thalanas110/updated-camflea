import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const authService = {
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: () => supabase.auth.getUser(),
};

// Items functions
export const itemsService = {
  getItems: async (filters?: any) => {
    let query = supabase
      .from('item')
      .select('*')
      .eq('is_available', true);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.priceMin) {
      query = query.gte('price', filters.priceMin);
    }
    if (filters?.priceMax) {
      query = query.lte('price', filters.priceMax);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getItemById: async (id: string) => {
    const { data, error } = await supabase
      .from('item')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createItem: async (itemData: any) => {
    const { data, error } = await supabase
      .from('item')
      .insert(itemData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateItem: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('item')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteItem: async (id: string) => {
    const { error } = await supabase
      .from('item')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Messages functions
export const messagesService = {
  getConversations: async (userId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, participants:profiles(*), last_message:messages(*)')
      .or(`participant1.eq.${userId},participant2.eq.${userId}`)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getMessages: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles(*)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  sendMessage: async (messageData: any) => {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select('*, sender:profiles(*)')
      .single();
    if (error) throw error;
    return data;
  },
};