import { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';
import { Sprout } from 'lucide-react-native';
import { storage } from '@/lib/storage';

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      
      // Check for demo session first (more reliable for demo)
      const demoSessionStr = await storage.getItem('demo_session');
      console.log('📱 Demo session check:', demoSessionStr ? 'Found' : 'Not found');
      
      if (demoSessionStr) {
        try {
          const session = JSON.parse(demoSessionStr);
          console.log('📊 Demo session data:', session);
          
          // Check if session is still valid
          if (session.expires_at > Date.now()) {
            console.log('✅ Valid demo session found, redirecting to welcome');
            
            // Use setTimeout to ensure proper navigation
            setTimeout(() => {
              router.replace('/onboarding/welcome');
            }, 100);
            return;
          } else {
            console.log('⏰ Demo session expired, removing...');
            // Demo session expired, remove it
            await storage.removeItem('demo_session');
            await storage.removeItem('demo_user');
            await storage.removeItem('demo_farmer_profile');
            await storage.removeItem('demo_buyer_profile');
            await storage.removeItem('demo_logistics_profile');
          }
        } catch (error) {
          console.log('❌ Invalid demo session, removing...');
          // Invalid demo session, remove it
          await storage.removeItem('demo_session');
          await storage.removeItem('demo_user');
          await storage.removeItem('demo_farmer_profile');
          await storage.removeItem('demo_buyer_profile');
          await storage.removeItem('demo_logistics_profile');
        }
      }

      // Check for Supabase session as fallback
      console.log('🔍 Checking Supabase session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('✅ Supabase session found');
        // Real Supabase session exists
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!userProfile) {
          // User authenticated but no profile - redirect to onboarding
          console.log('👤 No user profile, redirecting to onboarding');
          router.replace('/onboarding/welcome');
          return;
        }

        // Check if farmer profile exists and is complete
        if (userProfile.role === 'farmer') {
          const { data: farmerProfile } = await supabase
            .from('farmer_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (!farmerProfile) {
            // Farmer but no profile - redirect to onboarding
            console.log('🚜 No farmer profile, redirecting to onboarding');
            router.replace('/onboarding/welcome');
            return;
          }
        }

        // All good - redirect to main app
        console.log('🎯 Complete profile found, redirecting to main app');
        router.replace('/(tabs)');
        return;
      }

      // No valid session - redirect to verification
      console.log('❌ No valid session found, redirecting to verify');
      router.replace('/auth/verify');
    } catch (error) {
      console.error('💥 Auth check error:', error);
      router.replace('/auth/verify');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContent}>
          <View style={styles.iconContainer}>
            <Sprout color={Colors.text.inverse} size={48} />
          </View>
          <Text style={styles.loadingText}>AgriConnect</Text>
          <Text style={styles.loadingSubtext}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* This should not be visible as router.replace should redirect */}
      <View style={styles.loadingContent}>
        <Text style={styles.loadingText}>Redirecting...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[600],
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  loadingSubtext: {
    fontSize: 16,
    color: Colors.text.inverse,
    opacity: 0.8,
  },
});