import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { storage } from './storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for mobile apps
  },
  global: {
    headers: {
      'X-Client-Info': 'agriconnect-mobile',
    },
  },
});

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Comprehensive logout utility that handles both demo and real authentication
export const logout = async () => {
  try {
    console.log('🚪 Starting comprehensive logout process...');
    
    // Clear all demo session data
    const demoKeys = [
      'demo_session',
      'demo_user', 
      'demo_farmer_profile',
      'demo_buyer_profile',
      'demo_logistics_profile'
    ];
    
    for (const key of demoKeys) {
      await storage.removeItem(key);
    }
    
    console.log('🗑️ Demo session data cleared');
    
    // Dispatch logout event for other components to listen to (only on web)
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('userLogout'));
    }
    
    // Sign out from Supabase (if authenticated)
    try {
      await signOut();
      console.log('✅ Supabase sign out successful');
    } catch (supabaseError) {
      console.log('⚠️ Supabase sign out error (may not be authenticated):', supabaseError);
      // Continue with logout even if Supabase sign out fails
    }
    
    console.log('✅ Comprehensive logout completed');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error };
  }
};