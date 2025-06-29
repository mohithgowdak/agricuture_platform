import { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { uploadVerificationDocument } from '@/lib/storage';
import { Colors } from '@/constants/Colors';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import DocumentPicker from '@/components/DocumentPicker';

export default function VerificationScreen() {
  const [documents, setDocuments] = useState({
    governmentId: null as File | null,
    farmDocument: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleDocumentSelected = (type: 'governmentId' | 'farmDocument') => (file: File) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const submitVerification = async () => {
    if (!documents.governmentId) {
      Alert.alert('Error', 'Please upload your government ID');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get farmer profile
      const { data: farmerProfile } = await supabase
        .from('farmer_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!farmerProfile) throw new Error('Farmer profile not found');

      const uploadPromises = [];

      // Upload government ID
      if (documents.governmentId) {
        const uploadResult = await uploadVerificationDocument(
          farmerProfile.id,
          'government_id',
          documents.governmentId,
          documents.governmentId.name
        );

        if (uploadResult.success) {
          uploadPromises.push(
            supabase
              .from('verification_documents')
              .insert({
                farmer_id: farmerProfile.id,
                document_type: 'government_id',
                document_url: uploadResult.path!,
              })
          );
        }
      }

      // Upload farm document if provided
      if (documents.farmDocument) {
        const uploadResult = await uploadVerificationDocument(
          farmerProfile.id,
          'farm_ownership',
          documents.farmDocument,
          documents.farmDocument.name
        );

        if (uploadResult.success) {
          uploadPromises.push(
            supabase
              .from('verification_documents')
              .insert({
                farmer_id: farmerProfile.id,
                document_type: 'farm_ownership',
                document_url: uploadResult.path!,
              })
          );
        }
      }

      await Promise.all(uploadPromises);

      Alert.alert(
        'Documents Submitted!',
        'Your verification documents have been submitted. We\'ll review them within 24-48 hours and notify you once approved.',
        [{ text: 'Continue to App', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color={Colors.text.secondary} size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Verification Required</Text>
            <Text style={styles.subtitle}>
              Upload documents to verify your identity and build trust with buyers
            </Text>
          </View>

          <View style={styles.documentSection}>
            <DocumentPicker
              title="Government ID"
              description="Upload a photo of your government-issued ID (passport, driver's license, etc.)"
              required={true}
              maxSizeMB={10}
              onDocumentSelected={handleDocumentSelected('governmentId')}
            />

            <DocumentPicker
              title="Farm Document"
              description="Upload proof of farm ownership or lease agreement (recommended for faster approval)"
              required={false}
              maxSizeMB={10}
              onDocumentSelected={handleDocumentSelected('farmDocument')}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Your documents are encrypted and secure. We only use them for verification purposes and will never share them with third parties.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={submitVerification}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </Text>
            {!loading && <ArrowRight color={Colors.text.inverse} size={20} />}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
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
    lineHeight: 24,
  },
  documentSection: {
    gap: 20,
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary[700],
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