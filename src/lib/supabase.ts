import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helper functions
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Token related functions
export const createToken = async (tokenData: any) => {
  const { data, error } = await supabase
    .from('tokens')
    .insert([tokenData])
    .select()
    .single();
  return { data, error };
};

export const getTokens = async () => {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getTokenBySymbol = async (symbol: string) => {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('symbol', symbol)
    .single();
  return { data, error };
};

// Transaction related functions
export const createTransaction = async (transactionData: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select()
    .single();
  return { data, error };
};

export const getTransactions = async (tokenSymbol?: string) => {
  let query = supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (tokenSymbol) {
    query = query.eq('token_symbol', tokenSymbol);
  }
  
  const { data, error } = await query;
  return { data, error };
};

// Chat related functions
export const sendMessage = async (messageData: any) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single();
  return { data, error };
};

export const getMessages = async (tokenSymbol: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('token_symbol', tokenSymbol)
    .order('created_at', { ascending: true });
  return { data, error };
};

// User profile functions
export const updateUserProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert([{ id: userId, ...profileData }])
    .select()
    .single();
  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// Subscription functions
export const createSubscription = async (subscriptionData: any) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([subscriptionData])
    .select()
    .single();
  return { data, error };
};

export const getSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};