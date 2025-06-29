import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';
import { ArrowRight, ArrowLeft, Building, Mail, Phone, MapPin, CreditCard, Gift } from 'lucide-react-native';
import { useUserRole } from '@/hooks/useUserRole';
import { storage } from '@/lib/storage';

export default function BuyerRegisterScreen() {
  const [step, setStep] = useState<'info' | 'company' | 'subscription'>('info');
  const [loading, setLoading] = useState(false);
  const { updateUserRole } = useUserRole();
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Company Info
    companyName: '',
    companyType: 'importer',
    businessAddress: '',
    businessLicense: '',
    
    // Subscription
    selectedPlan: 'free', // Default to free plan
  });

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      period: 'forever',
      popular: false,
      features: [
        'Browse verified farmers',
        'Basic search functionality',
        'Up to 3 inquiries per month',
        'Community support',
        'Basic profile creation'
      ]
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 99,
      period: 'month',
      popular: true,
      features: [
        'Everything in Free',
        'Advanced search and filters',
        'Direct messaging',
        'Up to 25 inquiries/month',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 299,
      period: 'month',
      popular: false,
      features: [
        'Everything in Basic',
        'Advanced analytics',
        'Priority support',
        'Unlimited inquiries',
        'Export documentation help',
        'Bulk sourcing tools'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 999,
      period: 'month',
      popular: false,
      features: [
        'Everything in Premium',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'API access',
        'Custom contracts'
      ]
    }
  ];

  const handleNext = () => {
    if (step === 'info') {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setStep('company');
    } else if (step === 'company') {
      if (!formData.companyName || !formData.businessAddress) {
        Alert.alert('Error', 'Please fill in all required company information');
        return;
      }
      setStep('subscription');
    }
  };

  const handleBack = () => {
    if (step === 'company') {
      setStep('info');
    } else if (step === 'subscription') {
      setStep('company');
    } else {
      router.back();
    }
  };

  const handleRegister = async () => {
    console.log('🚀 Starting buyer registration...');
    setLoading(true);
    
    try {
      // Update user role to buyer
      updateUserRole('buyer');
      
      // Create demo buyer profile
      const mockBuyerProfile = {
        id: `buyer_${Date.now()}`,
        companyName: formData.companyName,
        contactPerson: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        businessAddress: formData.businessAddress,
        companyType: formData.companyType,
        businessLicense: formData.businessLicense,
        selectedPlan: formData.selectedPlan,
        created_at: new Date().toISOString(),
        verification_status: 'pending',
      };

      // Store demo buyer profile
      await storage.setItem('demo_buyer_profile', JSON.stringify(mockBuyerProfile));
      console.log('💾 Demo buyer profile stored:', mockBuyerProfile);
      
      // Update demo user with buyer role
      const demoUserStr = await storage.getItem('demo_user');
      if (demoUserStr) {
        const user = JSON.parse(demoUserStr);
        user.role = 'buyer';
        await storage.setItem('demo_user', JSON.stringify(user));
      }

      console.log('✅ Buyer registration successful!');
      
      // Show success message and navigate
      const selectedPlanName = subscriptionPlans.find(p => p.id === formData.selectedPlan)?.name || 'Selected Plan';
      
      Alert.alert(
        'Registration Successful!',
        `Welcome to AgriConnect! You're now on the ${selectedPlanName}. You can start connecting with farmers immediately.`,
        [{ 
          text: 'Continue to App', 
          onPress: () => {
            console.log('🎯 Navigating to main app...');
            // Navigate to main app with a slight delay
            setTimeout(() => {
              try {
                router.replace('/(tabs)');
                console.log('✅ Navigation to tabs executed');
              } catch (navError) {
                console.error('❌ Navigation error:', navError);
                // Navigation failed, but we'll continue anyway
              }
            }, 100);
          }
        }]
      );
    } catch (error: any) {
      console.error('💥 Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="John"
          value={formData.firstName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Doe"
          value={formData.lastName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="john@company.com"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderCompanyInfo = () => (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Company Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Global Foods Inc."
          value={formData.companyName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Business Type</Text>
        <View style={styles.radioGroup}>
          {[
            { value: 'importer', label: 'Importer' },
            { value: 'distributor', label: 'Distributor' },
            { value: 'retailer', label: 'Retailer' },
            { value: 'processor', label: 'Food Processor' }
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.radioOption,
                formData.companyType === option.value && styles.radioOptionSelected
              ]}
              onPress={() => setFormData(prev => ({ ...prev, companyType: option.value }))}
            >
              <Text style={[
                styles.radioText,
                formData.companyType === option.value && styles.radioTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Business Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="123 Business St, City, Country"
          value={formData.businessAddress}
          onChangeText={(text) => setFormData(prev => ({ ...prev, businessAddress: text }))}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Business License Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Optional - helps with verification"
          value={formData.businessLicense}
          onChangeText={(text) => setFormData(prev => ({ ...prev, businessLicense: text }))}
        />
      </View>
    </View>
  );

  const renderSubscription = () => (
    <View style={styles.form}>
      <Text style={styles.sectionTitle}>Choose Your Plan</Text>
      <Text style={styles.sectionSubtitle}>
        Start with our free plan and upgrade anytime as your business grows
      </Text>

      <View style={styles.plansContainer}>
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              formData.selectedPlan === plan.id && styles.planCardSelected,
              { borderColor: formData.selectedPlan === plan.id ? Colors.primary[600] : Colors.neutral[200] }
            ]}
            onPress={() => setFormData(prev => ({ ...prev, selectedPlan: plan.id }))}
          >
            <View style={styles.planHeader}>
              <View style={styles.planTitleRow}>
                <Text style={styles.planName}>{plan.name}</Text>
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                {plan.id === 'free' && (
                  <View style={styles.freeBadge}>
                    <Gift color={Colors.success[600]} size={16} />
                    <Text style={styles.freeText}>Free</Text>
                  </View>
                )}
              </View>
              <View style={styles.priceContainer}>
                {plan.price === 0 ? (
                  <Text style={styles.freePrice}>Free Forever</Text>
                ) : (
                  <>
                    <Text style={styles.planPrice}>${plan.price}</Text>
                    <Text style={styles.planPeriod}>/{plan.period}</Text>
                  </>
                )}
              </View>
            </View>
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.planFeature}>• {feature}</Text>
              ))}
            </View>
            {formData.selectedPlan === plan.id && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>✓ Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.planNote}>
        <Text style={styles.planNoteText}>
          💡 You can upgrade or downgrade your plan anytime from your profile settings
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ArrowLeft color={Colors.text.secondary} size={24} />
              </TouchableOpacity>
              
              <View style={styles.progressContainer}>
                {['info', 'company', 'subscription'].map((stepName, index) => (
                  <View
                    key={stepName}
                    style={[
                      styles.progressDot,
                      (step === stepName || 
                       (step === 'company' && stepName === 'info') ||
                       (step === 'subscription' && (stepName === 'info' || stepName === 'company'))
                      ) && styles.progressDotActive
                    ]}
                  />
                ))}
              </View>

              <Text style={styles.title}>
                {step === 'info' && 'Personal Information'}
                {step === 'company' && 'Company Details'}
                {step === 'subscription' && 'Choose Your Plan'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 'info' && 'Tell us about yourself'}
                {step === 'company' && 'Tell us about your business'}
                {step === 'subscription' && 'Select a subscription plan'}
              </Text>
            </View>

            {step === 'info' && renderPersonalInfo()}
            {step === 'company' && renderCompanyInfo()}
            {step === 'subscription' && renderSubscription()}

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={step === 'subscription' ? handleRegister : handleNext}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating Account...' : 
                 step === 'subscription' ? 'Complete Registration' : 'Continue'}
              </Text>
              {!loading && <ArrowRight color={Colors.text.inverse} size={20} />}
            </TouchableOpacity>

            {/* Debug Info */}
            <View style={styles.debugInfo}>
              <Text style={styles.debugText}>
                🔍 Debug: Selected Plan: {formData.selectedPlan}
              </Text>
              <Text style={styles.debugText}>
                📧 Email: {formData.email || 'Not set'}
              </Text>
              <Text style={styles.debugText}>
                🏢 Company: {formData.companyName || 'Not set'}
              </Text>
            </View>
          </View>
        </ScrollView>
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
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral[300],
  },
  progressDotActive: {
    backgroundColor: Colors.primary[600],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
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
  textArea: {
    height: 80,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.surface,
  },
  radioOptionSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  radioText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  radioTextSelected: {
    color: Colors.primary[700],
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  planHeader: {
    marginBottom: 16,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  popularBadge: {
    backgroundColor: Colors.accent[600],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success[200],
  },
  freeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.success[700],
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary[600],
  },
  planPeriod: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 2,
  },
  freePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.success[600],
  },
  planFeatures: {
    gap: 8,
  },
  planFeature: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  planNote: {
    backgroundColor: Colors.accent[50],
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  planNoteText: {
    fontSize: 14,
    color: Colors.accent[700],
    textAlign: 'center',
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
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
});