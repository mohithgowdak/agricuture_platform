import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';
import { sendOTPSMS, verifyOTP, sendOTPEmail } from '@/lib/freeOtpService';
import { Phone, ArrowRight, Mail, MessageCircle, ArrowLeft } from 'lucide-react-native';
import { storage } from '@/lib/storage';

export default function VerifyScreen() {
  const [method, setMethod] = useState<'phone' | 'email'>('email');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'contact' | 'otp'>('contact');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTP = async () => {
    if (!contact.trim()) {
      Alert.alert('Error', `Please enter a valid ${method === 'phone' ? 'phone number' : 'email address'}`);
      return;
    }

    // Basic validation
    if (method === 'email' && !contact.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (method === 'phone' && contact.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number with country code');
      return;
    }

    setLoading(true);
    try {
      let result;
      
      if (method === 'phone') {
        // Format phone number (add + if missing)
        const formattedPhone = contact.startsWith('+') ? contact : `+${contact}`;
        result = await sendOTPSMS(formattedPhone);
      } else {
        result = await sendOTPEmail(contact);
      }

      if (result.success) {
        setStep('otp');
        setCountdown(60);
        Alert.alert(
          'Code Sent!', 
          `Verification code sent to your ${method === 'phone' ? 'phone' : 'email'}. ${method === 'email' ? 'Check the alert/console for demo.' : ''}`
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to send verification code');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPCode = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Starting verification process...');
      console.log('Verifying OTP:', otp, 'for contact:', contact);
      
      const result = verifyOTP(contact, otp);
      console.log('✅ Verification result:', result);
      
      if (result.success) {
        console.log('🎉 OTP verification successful!');
        
        // Create demo session for both email and phone
        const mockUser = {
          id: `demo_${Date.now()}`,
          email: method === 'email' ? contact : undefined,
          phone: method === 'phone' ? contact : undefined,
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          role: 'authenticated'
        };

        // Store demo session with proper expiration
        const session = {
          access_token: `demo_token_${Date.now()}`,
          refresh_token: `demo_refresh_${Date.now()}`,
          expires_in: 3600,
          expires_at: Date.now() + 3600000, // 1 hour from now
          token_type: 'bearer',
          user: mockUser
        };
        
        await storage.setItem('demo_session', JSON.stringify(session));
        await storage.setItem('demo_user', JSON.stringify(mockUser));
        
        console.log('💾 Demo session stored:', session);

        // Navigate to welcome screen with a slight delay to ensure state is saved
        console.log('🚀 Navigating to welcome screen...');
        
        // Use setTimeout to ensure localStorage is written before navigation
        setTimeout(() => {
          try {
            console.log('📍 Attempting navigation to /onboarding/welcome');
            router.replace('/onboarding/welcome');
            console.log('✅ Navigation command executed');
          } catch (navError) {
            console.error('❌ Navigation error:', navError);
            // Navigation failed, but we'll continue anyway
          }
        }, 100);

        // Show success message
        Alert.alert(
          'Verification Successful!',
          `Welcome to AgriConnect! Your ${method} has been verified.`,
          [{ 
            text: 'Continue', 
            onPress: () => {
              console.log('🎯 Alert button pressed, ensuring navigation...');
              // Double-check navigation
              setTimeout(() => {
                try {
                  router.replace('/onboarding/welcome');
                } catch (navError) {
                  console.error('❌ Navigation error:', navError);
                }
              }, 500);
            }
          }]
        );
      } else {
        console.log('❌ Verification failed:', result.error);
        Alert.alert('Error', result.error || 'Invalid verification code');
      }
    } catch (error: any) {
      console.error('💥 Verification error:', error);
      Alert.alert('Error', error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    await sendOTP();
  };

  const tryDemoCode = () => {
    console.log('🧪 Trying demo codes...');
    const demoCodes = ['214637', '676577', '123456', '000000'];
    
    for (const code of demoCodes) {
      console.log(`🔍 Trying demo code: ${code}`);
      const result = verifyOTP(contact, code);
      if (result.success) {
        console.log(`✅ Demo code ${code} worked!`);
        setOtp(code);
        // Auto-verify after setting the code
        setTimeout(() => verifyOTPCode(), 100);
        break;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            {step === 'otp' && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setStep('contact')}
              >
                <ArrowLeft color={Colors.text.secondary} size={24} />
              </TouchableOpacity>
            )}
            
            <View style={styles.iconContainer}>
              {method === 'phone' ? (
                <Phone color={Colors.primary[600]} size={32} />
              ) : (
                <Mail color={Colors.primary[600]} size={32} />
              )}
            </View>
            
            <Text style={styles.title}>
              {step === 'contact' 
                ? 'Welcome to AgriConnect'
                : 'Enter verification code'
              }
            </Text>
            
            <Text style={styles.subtitle}>
              {step === 'contact' 
                ? `Enter your ${method === 'phone' ? 'phone number' : 'email'} to get started`
                : `We sent a 6-digit code to ${contact}`
              }
            </Text>
          </View>

          {step === 'contact' && (
            <View style={styles.methodSelector}>
              <TouchableOpacity
                style={[styles.methodButton, method === 'email' && styles.methodButtonActive]}
                onPress={() => setMethod('email')}
              >
                <Mail color={method === 'email' ? Colors.primary[600] : Colors.neutral[500]} size={20} />
                <Text style={[
                  styles.methodButtonText,
                  method === 'email' && styles.methodButtonTextActive
                ]}>
                  Email
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.methodButton, method === 'phone' && styles.methodButtonActive]}
                onPress={() => setMethod('phone')}
              >
                <Phone color={method === 'phone' ? Colors.primary[600] : Colors.neutral[500]} size={20} />
                <Text style={[
                  styles.methodButtonText,
                  method === 'phone' && styles.methodButtonTextActive
                ]}>
                  SMS
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.form}>
            {step === 'contact' ? (
              <TextInput
                style={styles.input}
                placeholder={method === 'phone' ? '+1 234 567 8900' : 'your@email.com'}
                value={contact}
                onChangeText={setContact}
                keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                autoFocus
              />
            ) : (
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="000000"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            )}

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={step === 'contact' ? sendOTP : verifyOTPCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading 
                  ? 'Please wait...' 
                  : step === 'contact' 
                    ? 'Send Code' 
                    : 'Verify & Continue'
                }
              </Text>
              {!loading && <ArrowRight color={Colors.text.inverse} size={20} />}
            </TouchableOpacity>

            {step === 'otp' && (
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={resendOTP}
                disabled={countdown > 0}
              >
                <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {step === 'contact' && (
            <View style={styles.infoBox}>
              <MessageCircle color={Colors.accent[600]} size={16} />
              <Text style={styles.infoText}>
                {method === 'phone' 
                  ? 'SMS: Free service with daily limits. For demo, codes appear in console/alert.'
                  : 'Email: Unlimited and recommended. For demo, codes appear in console/alert.'
                }
              </Text>
            </View>
          )}

          {step === 'otp' && (
            <View style={styles.demoHelper}>
              <Text style={styles.demoHelperText}>
                🔍 Demo Mode: Check the browser console or alert for your verification code
              </Text>
              <TouchableOpacity 
                style={styles.demoButton}
                onPress={tryDemoCode}
              >
                <Text style={styles.demoButtonText}>Try Demo Code</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.surface,
  },
  methodButtonActive: {
    borderColor: Colors.primary[300],
    backgroundColor: Colors.primary[50],
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[500],
  },
  methodButtonTextActive: {
    color: Colors.primary[700],
  },
  form: {
    gap: 16,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Colors.surface,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
  },
  button: {
    height: 56,
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resendText: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: '500',
  },
  resendDisabled: {
    color: Colors.neutral[400],
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.accent[50],
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.accent[700],
    lineHeight: 20,
  },
  demoHelper: {
    backgroundColor: Colors.warning[50],
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    gap: 12,
  },
  demoHelperText: {
    fontSize: 14,
    color: Colors.warning[700],
    textAlign: 'center',
    lineHeight: 20,
  },
  demoButton: {
    backgroundColor: Colors.warning[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.inverse,
  },
});