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
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react-native';
import ImagePicker from '@/components/ImagePicker';
import { storage } from '@/lib/storage';

export default function ProfileSetupScreen() {
  const [formData, setFormData] = useState({
    farmName: '',
    bio: '',
    location: null as { lat: number; lng: number; address: string } | null,
    profilePhoto: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      console.log('📍 Getting current location...');
      
      if (Platform.OS === 'web') {
        // Web geolocation API
        if (!navigator.geolocation) {
          Alert.alert('Error', 'Geolocation is not supported by this browser');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('📍 Location obtained:', latitude, longitude);
            
            // Use a reverse geocoding service or set a default address
            const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
            setFormData(prev => ({
              ...prev,
              location: {
                lat: latitude,
                lng: longitude,
                address: address,
              }
            }));
            setGettingLocation(false);
          },
          (error) => {
            console.error('📍 Location error:', error);
            Alert.alert('Error', 'Could not get your location. Please try again.');
            setGettingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        // For native platforms, you would use expo-location here
        // For now, we'll simulate location for demo purposes
        const mockLocation = {
          lat: 40.7128,
          lng: -74.0060,
          address: 'New York, NY, USA'
        };
        
        setFormData(prev => ({
          ...prev,
          location: mockLocation
        }));
        setGettingLocation(false);
      }
    } catch (error) {
      console.error('📍 Location error:', error);
      Alert.alert('Error', 'Could not get your location. Please try again.');
      setGettingLocation(false);
    }
  };

  const handleImageSelected = (file: File) => {
    console.log('📷 Image selected:', file.name);
    setFormData(prev => ({ ...prev, profilePhoto: file }));
  };

  const createProfile = async () => {
    console.log('🚀 Starting profile creation...');
    
    if (!formData.farmName.trim()) {
      Alert.alert('Error', 'Please enter your farm name');
      return;
    }

    if (!formData.location) {
      Alert.alert('Error', 'Please add your farm location');
      return;
    }

    setLoading(true);
    try {
      console.log('💾 Creating demo profile...');
      
      // For demo purposes, we'll create a mock profile
      // In production, this would save to Supabase
      
      const mockProfile = {
        id: `farmer_${Date.now()}`,
        farmName: formData.farmName,
        location: formData.location,
        bio: formData.bio,
        profilePhoto: formData.profilePhoto ? 'demo-photo.jpg' : null,
        created_at: new Date().toISOString(),
        verification_status: 'pending',
      };

      // Store demo profile
      await storage.setItem('demo_farmer_profile', JSON.stringify(mockProfile));
      console.log('💾 Demo profile stored:', mockProfile);

      console.log('✅ Profile creation successful!');
      
      // Navigate to main app with a slight delay
      setTimeout(() => {
        console.log('🎯 Navigating to main app...');
        try {
          router.replace('/(tabs)');
          console.log('✅ Navigation to tabs executed');
        } catch (navError) {
          console.error('❌ Navigation error:', navError);
          // Navigation failed, but we'll continue anyway
        }
      }, 100);

      Alert.alert(
        'Profile Created!', 
        'Your farm profile has been created successfully. You can now start using AgriConnect!',
        [{ 
          text: 'Continue to App', 
          onPress: () => {
            console.log('🎯 Alert button pressed, ensuring navigation...');
            setTimeout(() => {
              if (!window.location.pathname.includes('tabs')) {
                console.log('⚠️ Not on tabs page, forcing navigation...');
                window.location.href = '/';
              }
            }, 500);
          }
        }]
      );
    } catch (error: any) {
      console.error('💥 Profile creation error:', error);
      Alert.alert('Error', error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft color={Colors.text.secondary} size={24} />
              </TouchableOpacity>
              <Text style={styles.title}>Create Your Farm Profile</Text>
              <Text style={styles.subtitle}>Tell us about your farm</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Profile Photo</Text>
                <ImagePicker
                  onImageSelected={handleImageSelected}
                  placeholder="Add Farm Photo"
                  maxSizeMB={5}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Farm Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Green Valley Farm"
                  value={formData.farmName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, farmName: text }))}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Farm Location *</Text>
                <TouchableOpacity 
                  style={[styles.locationButton, formData.location && styles.locationButtonActive]}
                  onPress={getCurrentLocation}
                  disabled={gettingLocation}
                >
                  <MapPin 
                    color={formData.location ? Colors.primary[600] : Colors.text.secondary} 
                    size={20} 
                  />
                  <Text style={[
                    styles.locationButtonText,
                    formData.location && styles.locationButtonTextActive
                  ]}>
                    {gettingLocation 
                      ? 'Getting location...' 
                      : formData.location 
                        ? formData.location.address 
                        : 'Get Current Location'
                    }
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>About Your Farm</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell buyers about your farming methods, experience, and what makes your crops special..."
                  value={formData.bio}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={createProfile}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating Profile...' : 'Complete Setup'}
              </Text>
              {!loading && <ArrowRight color={Colors.text.inverse} size={20} />}
            </TouchableOpacity>

            {/* Debug Info */}
            <View style={styles.debugInfo}>
              <Text style={styles.debugText}>
                🔍 Debug: Farm Name: {formData.farmName || 'Not set'}
              </Text>
              <Text style={styles.debugText}>
                📍 Location: {formData.location ? 'Set' : 'Not set'}
              </Text>
              <Text style={styles.debugText}>
                📷 Photo: {formData.profilePhoto ? 'Selected' : 'Not selected'}
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
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  locationButton: {
    height: 56,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
  },
  locationButtonActive: {
    borderColor: Colors.primary[300],
    backgroundColor: Colors.primary[50],
  },
  locationButtonText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  locationButtonTextActive: {
    color: Colors.primary[700],
    fontWeight: '500',
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