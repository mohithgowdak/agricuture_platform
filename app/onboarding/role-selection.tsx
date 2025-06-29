import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ArrowRight, Package, Building, Truck, Users, Globe, Shield } from 'lucide-react-native';
import { useUserRole } from '@/hooks/useUserRole';

type UserRole = 'farmer' | 'buyer' | 'logistics';

interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  benefits: string[];
}

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateUserRole } = useUserRole();

  const roleOptions: RoleOption[] = [
    {
      id: 'farmer',
      title: 'Farmer',
      subtitle: 'Sell your crops directly',
      description: 'Connect with global buyers and get better prices for your harvest',
      icon: Package,
      color: Colors.primary[600],
      benefits: [
        'Direct access to global buyers',
        'Better prices for your crops',
        'Secure payment processing',
        'Quality verification support'
      ]
    },
    {
      id: 'buyer',
      title: 'Buyer',
      subtitle: 'Source quality crops',
      description: 'Find verified farmers and source premium agricultural products',
      icon: Building,
      color: Colors.accent[600],
      benefits: [
        'Access to verified farmers',
        'Quality assurance programs',
        'Bulk sourcing capabilities',
        'Logistics coordination'
      ]
    },
    {
      id: 'logistics',
      title: 'Logistics Partner',
      subtitle: 'Facilitate trade',
      description: 'Provide shipping and logistics services to farmers and buyers',
      icon: Truck,
      color: Colors.secondary[600],
      benefits: [
        'Connect with farmers & buyers',
        'Expand your service network',
        'Verified partner status',
        'Integrated booking system'
      ]
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role to continue');
      return;
    }

    setLoading(true);
    try {
      // Update user role
      updateUserRole(selectedRole);

      // Update demo user data
      if (typeof window !== 'undefined') {
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
          const user = JSON.parse(demoUser);
          user.role = selectedRole;
          localStorage.setItem('demo_user', JSON.stringify(user));
        }
      }

      // Navigate based on role
      if (selectedRole === 'farmer') {
        router.replace('/onboarding/profile-setup');
      } else if (selectedRole === 'buyer') {
        router.replace('/buyer/register');
      } else if (selectedRole === 'logistics') {
        router.replace('/logistics/register');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to set role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Users color={Colors.primary[600]} size={48} />
          </View>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you want to participate in the AgriConnect marketplace
          </Text>
        </View>

        <View style={styles.rolesContainer}>
          {roleOptions.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardSelected,
                  { borderColor: isSelected ? role.color : Colors.neutral[200] }
                ]}
                onPress={() => handleRoleSelect(role.id)}
              >
                <View style={styles.roleHeader}>
                  <View style={[styles.roleIconContainer, { backgroundColor: role.color + '20' }]}>
                    <IconComponent color={role.color} size={32} />
                  </View>
                  <View style={styles.roleTitleContainer}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Shield color={role.color} size={20} />
                    </View>
                  )}
                </View>

                <Text style={styles.roleDescription}>{role.description}</Text>

                <View style={styles.benefitsContainer}>
                  <Text style={styles.benefitsTitle}>Key Benefits:</Text>
                  {role.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <View style={[styles.benefitDot, { backgroundColor: role.color }]} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled,
            loading && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedRole || loading}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedRole && styles.continueButtonTextDisabled
          ]}>
            {loading ? 'Setting up...' : 'Continue'}
          </Text>
          {!loading && selectedRole && (
            <ArrowRight color={Colors.text.inverse} size={20} />
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Globe color={Colors.accent[600]} size={16} />
          <Text style={styles.infoText}>
            You can always change your role later in your profile settings
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  rolesContainer: {
    flex: 1,
    gap: 16,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
  },
  roleCardSelected: {
    backgroundColor: Colors.primary[25],
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitleContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  roleSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleDescription: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginBottom: 16,
  },
  benefitsContainer: {
    gap: 8,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  continueButton: {
    height: 56,
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  continueButtonTextDisabled: {
    color: Colors.neutral[500],
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accent[50],
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.accent[700],
    flex: 1,
  },
});