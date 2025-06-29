import { useState } from 'react';
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
import { ArrowRight, ArrowLeft, Truck, Ship, Plane, Package, Shield, Globe } from 'lucide-react-native';

export default function LogisticsRegisterScreen() {
  const [step, setStep] = useState<'info' | 'services' | 'verification'>('info');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessAddress: '',
    
    // Services
    serviceTypes: [] as string[],
    operatingRegions: [] as string[],
    specializations: [] as string[],
    
    // Verification
    businessLicense: '',
    insuranceCertificate: '',
    transportLicense: '',
  });

  const serviceOptions = [
    { id: 'road_transport', label: 'Road Transport', icon: Truck },
    { id: 'sea_freight', label: 'Sea Freight', icon: Ship },
    { id: 'air_freight', label: 'Air Freight', icon: Plane },
    { id: 'warehousing', label: 'Warehousing', icon: Package },
    { id: 'customs_clearance', label: 'Customs Clearance', icon: Shield },
    { id: 'door_to_door', label: 'Door-to-Door', icon: Globe },
  ];

  const regionOptions = [
    'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Middle East'
  ];

  const specializationOptions = [
    'Temperature Controlled', 'Bulk Cargo', 'Containerized', 'Perishables', 
    'Organic Products', 'Hazardous Materials', 'Oversized Cargo'
  ];

  const toggleSelection = (array: string[], value: string, setter: (prev: any) => void) => {
    setter((prev: any) => ({
      ...prev,
      [array]: prev[array].includes(value)
        ? prev[array].filter((item: string) => item !== value)
        : [...prev[array], value]
    }));
  };

  const handleNext = () => {
    if (step === 'info') {
      if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setStep('services');
    } else if (step === 'services') {
      if (formData.serviceTypes.length === 0 || formData.operatingRegions.length === 0) {
        Alert.alert('Error', 'Please select at least one service type and operating region');
        return;
      }
      setStep('verification');
    }
  };

  const handleBack = () => {
    if (step === 'services') {
      setStep('info');
    } else if (step === 'verification') {
      setStep('services');
    } else {
      router.back();
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // In a real app, you would:
      // 1. Create logistics partner account
      // 2. Upload verification documents
      // 3. Set up partner profile
      // 4. Send for admin approval
      
      // For demo purposes, we'll simulate the registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Application Submitted!',
        'Thank you for applying to become a logistics partner. We will review your application and contact you within 2-3 business days.',
        [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCompanyInfo = () => (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Company Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Global Logistics Solutions"
          value={formData.companyName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Contact Person *</Text>
        <TextInput
          style={styles.input}
          placeholder="John Smith"
          value={formData.contactPerson}
          onChangeText={(text) => setFormData(prev => ({ ...prev, contactPerson: text }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="contact@logistics.com"
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

      <View style={styles.field}>
        <Text style={styles.label}>Business Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="123 Logistics Ave, City, Country"
          value={formData.businessAddress}
          onChangeText={(text) => setFormData(prev => ({ ...prev, businessAddress: text }))}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderServices = () => (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Service Types *</Text>
        <Text style={styles.fieldDescription}>Select all services you provide</Text>
        <View style={styles.optionsGrid}>
          {serviceOptions.map((service) => {
            const IconComponent = service.icon;
            const isSelected = formData.serviceTypes.includes(service.id);
            return (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceOption, isSelected && styles.serviceOptionSelected]}
                onPress={() => toggleSelection('serviceTypes', service.id, setFormData)}
              >
                <IconComponent 
                  color={isSelected ? Colors.primary[600] : Colors.neutral[500]} 
                  size={24} 
                />
                <Text style={[
                  styles.serviceOptionText,
                  isSelected && styles.serviceOptionTextSelected
                ]}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Operating Regions *</Text>
        <Text style={styles.fieldDescription}>Select regions where you operate</Text>
        <View style={styles.tagsContainer}>
          {regionOptions.map((region) => {
            const isSelected = formData.operatingRegions.includes(region);
            return (
              <TouchableOpacity
                key={region}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => toggleSelection('operatingRegions', region, setFormData)}
              >
                <Text style={[
                  styles.tagText,
                  isSelected && styles.tagTextSelected
                ]}>
                  {region}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Specializations</Text>
        <Text style={styles.fieldDescription}>Optional - Select your areas of expertise</Text>
        <View style={styles.tagsContainer}>
          {specializationOptions.map((spec) => {
            const isSelected = formData.specializations.includes(spec);
            return (
              <TouchableOpacity
                key={spec}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => toggleSelection('specializations', spec, setFormData)}
              >
                <Text style={[
                  styles.tagText,
                  isSelected && styles.tagTextSelected
                ]}>
                  {spec}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderVerification = () => (
    <View style={styles.form}>
      <Text style={styles.sectionTitle}>Verification Documents</Text>
      <Text style={styles.sectionSubtitle}>
        Upload required documents to verify your logistics company
      </Text>

      <View style={styles.documentSection}>
        <View style={styles.documentCard}>
          <View style={styles.documentHeader}>
            <Shield color={Colors.primary[600]} size={24} />
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Business License *</Text>
              <Text style={styles.documentDescription}>
                Valid business registration or incorporation certificate
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.documentCard}>
          <View style={styles.documentHeader}>
            <Shield color={Colors.accent[600]} size={24} />
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Insurance Certificate *</Text>
              <Text style={styles.documentDescription}>
                Proof of cargo and liability insurance coverage
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.documentCard}>
          <View style={styles.documentHeader}>
            <Truck color={Colors.secondary[600]} size={24} />
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Transport License</Text>
              <Text style={styles.documentDescription}>
                Commercial transport license (if applicable)
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          All documents are securely encrypted and only used for verification purposes. 
          Your application will be reviewed within 2-3 business days.
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
                {['info', 'services', 'verification'].map((stepName, index) => (
                  <View
                    key={stepName}
                    style={[
                      styles.progressDot,
                      (step === stepName || 
                       (step === 'services' && stepName === 'info') ||
                       (step === 'verification' && (stepName === 'info' || stepName === 'services'))
                      ) && styles.progressDotActive
                    ]}
                  />
                ))}
              </View>

              <Text style={styles.title}>
                {step === 'info' && 'Company Information'}
                {step === 'services' && 'Services & Coverage'}
                {step === 'verification' && 'Verification'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 'info' && 'Tell us about your logistics company'}
                {step === 'services' && 'What services do you provide?'}
                {step === 'verification' && 'Upload verification documents'}
              </Text>
            </View>

            {step === 'info' && renderCompanyInfo()}
            {step === 'services' && renderServices()}
            {step === 'verification' && renderVerification()}

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={step === 'verification' ? handleRegister : handleNext}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Submitting Application...' : 
                 step === 'verification' ? 'Submit Application' : 'Continue'}
              </Text>
              {!loading && <ArrowRight color={Colors.text.inverse} size={20} />}
            </TouchableOpacity>
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
  fieldDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceOption: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
  },
  serviceOptionSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  serviceOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  serviceOptionTextSelected: {
    color: Colors.primary[700],
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.surface,
  },
  tagSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  tagText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  tagTextSelected: {
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
  documentSection: {
    gap: 16,
  },
  documentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  uploadButton: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.primary[600],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[50],
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  infoBox: {
    backgroundColor: Colors.accent[50],
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.accent[700],
    lineHeight: 20,
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
});