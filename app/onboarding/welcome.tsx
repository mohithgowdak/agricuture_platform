import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';
import { Sprout, ArrowRight } from 'lucide-react-native';

export default function WelcomeScreen() {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email?: string; phone?: string } | null>(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      console.log('👤 Getting user info...');
      
      // Check for demo session first
      if (typeof window !== 'undefined') {
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
          const user = JSON.parse(demoUser);
          console.log('👤 Demo user found:', user);
          setUserInfo({
            email: user.email,
            phone: user.phone,
          });
          return;
        }
      }

      // Fallback to Supabase user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('👤 Supabase user found:', user);
        setUserInfo({
          email: user.email,
          phone: user.phone,
        });
      }
    } catch (error) {
      console.error('👤 Error getting user info:', error);
    }
  };

  const handleGetStarted = async () => {
    setLoading(true);
    try {
      console.log('🚀 Starting onboarding process...');
      
      // Check if we have a demo farmer profile
      if (typeof window !== 'undefined') {
        const demoProfile = localStorage.getItem('demo_farmer_profile');
        if (demoProfile) {
          console.log('🚜 Demo profile exists, going to main app');
          // Demo profile exists, go to main app
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 100);
          return;
        }
      }

      // Check if we have a real Supabase user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('👤 Real Supabase user found, checking profile...');
        // Real user - check if profile exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (existingUser) {
          console.log('✅ User profile exists, going to main app');
          // User already has profile, go to main app
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 100);
          return;
        }
      }

      // New user or demo user - go to role selection
      console.log('📝 New user, going to role selection');
      setTimeout(() => {
        router.push('/onboarding/role-selection');
      }, 100);
    } catch (error: any) {
      console.error('🚀 Error checking user status:', error);
      // Continue to role selection anyway
      setTimeout(() => {
        router.push('/onboarding/role-selection');
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sprout color={Colors.primary[600]} size={48} />
          </View>
          <Text style={styles.title}>Welcome to AgriConnect</Text>
          <Text style={styles.subtitle}>
            Connect directly with global buyers and sell your crops at better prices
          </Text>
          {userInfo && (
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfo}>
                ✅ Verified: {userInfo.email || userInfo.phone}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Get verified and build trust with buyers</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>List your crops with photos and details</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Communicate directly with interested buyers</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Keep more of what you earn</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGetStarted}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Get Started'}
          </Text>
          {!loading && <ArrowRight color={Colors.text.inverse} size={20} />}
        </TouchableOpacity>

        {/* Debug Info */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            🔍 User: {userInfo?.email || userInfo?.phone || 'Not found'}
          </Text>
          <Text style={styles.debugText}>
            📱 Demo Profile: {typeof window !== 'undefined' && localStorage.getItem('demo_farmer_profile') ? 'Exists' : 'Not found'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  userInfoContainer: {
    backgroundColor: Colors.success[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.success[200],
  },
  userInfo: {
    fontSize: 14,
    color: Colors.success[700],
    fontWeight: '500',
  },
  features: {
    gap: 20,
    paddingVertical: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
    marginTop: 6,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  button: {
    height: 56,
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  debugInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
});