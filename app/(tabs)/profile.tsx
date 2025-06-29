import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { User, MapPin, Phone, Mail, CreditCard as Edit, Settings, Shield, Star, Package, TrendingUp, LogOut, Camera, Building, Truck, Users } from 'lucide-react-native';
import { useUserRole } from '@/hooks/useUserRole';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profilePhoto: string;
  verified: boolean;
  rating: number;
  joinedDate: string;
  role: 'farmer' | 'buyer' | 'logistics';
  // Role-specific data
  farmName?: string;
  companyName?: string;
  bio?: string;
  crops?: number;
  totalSales?: number;
  activeOrders?: number;
}

export default function ProfileScreen() {
  const { userRole, updateUserRole } = useUserRole();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userRole]);

  const loadProfile = () => {
    // Mock profile data based on user role
    const mockProfile: UserProfile = {
      id: 'demo_user_1',
      name: userRole === 'farmer' ? 'Rajesh Kumar' : userRole === 'buyer' ? 'Global Foods Ltd.' : 'Swift Logistics',
      email: 'demo@agriconnect.com',
      phone: '+91 98765 43210',
      location: userRole === 'farmer' ? 'Punjab, India' : userRole === 'buyer' ? 'Mumbai, India' : 'Delhi, India',
      profilePhoto: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
      verified: true,
      rating: 4.8,
      joinedDate: '2023-01-15',
      role: userRole || 'farmer',
      farmName: userRole === 'farmer' ? 'Green Valley Organic Farm' : undefined,
      companyName: userRole !== 'farmer' ? (userRole === 'buyer' ? 'Global Foods International' : 'Swift Cargo Solutions') : undefined,
      bio: userRole === 'farmer' ? 'Organic farming specialist with 15+ years experience' : undefined,
      crops: userRole === 'farmer' ? 12 : undefined,
      totalSales: userRole === 'farmer' ? 450 : userRole === 'buyer' ? 1200 : 850,
      activeOrders: userRole === 'farmer' ? 8 : userRole === 'buyer' ? 15 : 22,
    };

    setProfile(mockProfile);
    setLoading(false);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettings = () => {
    router.push('/profile/settings');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Clear demo session
            if (typeof window !== 'undefined') {
              localStorage.removeItem('demo_session');
              localStorage.removeItem('demo_user');
              localStorage.removeItem('demo_farmer_profile');
            }
            router.replace('/auth/verify');
          }
        }
      ]
    );
  };

  const handleRoleSwitch = () => {
    Alert.alert(
      'Switch Role',
      'Choose your role for demo purposes:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Farmer', onPress: () => updateUserRole('farmer') },
        { text: 'Buyer', onPress: () => updateUserRole('buyer') },
        { text: 'Logistics', onPress: () => updateUserRole('logistics') },
      ]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        color={i < Math.floor(rating) ? Colors.warning[500] : Colors.neutral[300]}
        fill={i < Math.floor(rating) ? Colors.warning[500] : 'transparent'}
      />
    ));
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'farmer':
        return <Package color={Colors.primary[600]} size={24} />;
      case 'buyer':
        return <Building color={Colors.accent[600]} size={24} />;
      case 'logistics':
        return <Truck color={Colors.secondary[600]} size={24} />;
      default:
        return <User color={Colors.neutral[500]} size={24} />;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'farmer':
        return Colors.primary[600];
      case 'buyer':
        return Colors.accent[600];
      case 'logistics':
        return Colors.secondary[600];
      default:
        return Colors.neutral[500];
    }
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
              <Settings color={Colors.text.secondary} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profile.profilePhoto }} style={styles.profileImage} />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera color={Colors.text.inverse} size={16} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{profile.name}</Text>
              {profile.verified && (
                <View style={styles.verifiedBadge}>
                  <Shield color={Colors.success[600]} size={16} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            <View style={styles.roleRow}>
              {getRoleIcon()}
              <Text style={[styles.roleText, { color: getRoleColor() }]}>
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              </Text>
            </View>

            {profile.farmName && (
              <Text style={styles.farmName}>{profile.farmName}</Text>
            )}
            {profile.companyName && (
              <Text style={styles.companyName}>{profile.companyName}</Text>
            )}

            <View style={styles.ratingRow}>
              {renderStars(profile.rating)}
              <Text style={styles.ratingText}>{profile.rating} rating</Text>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit color={Colors.primary[600]} size={16} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Mail color={Colors.neutral[500]} size={20} />
              <Text style={styles.contactText}>{profile.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone color={Colors.neutral[500]} size={20} />
              <Text style={styles.contactText}>{profile.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <MapPin color={Colors.neutral[500]} size={20} />
              <Text style={styles.contactText}>{profile.location}</Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            {userRole === 'farmer' && profile.crops && (
              <View style={styles.statCard}>
                <Package color={Colors.primary[600]} size={24} />
                <Text style={styles.statNumber}>{profile.crops}</Text>
                <Text style={styles.statLabel}>Active Crops</Text>
              </View>
            )}
            <View style={styles.statCard}>
              <TrendingUp color={Colors.accent[600]} size={24} />
              <Text style={styles.statNumber}>{profile.totalSales}</Text>
              <Text style={styles.statLabel}>
                {userRole === 'farmer' ? 'Total Sales (tons)' : userRole === 'buyer' ? 'Total Purchases (tons)' : 'Shipments Delivered'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Users color={Colors.secondary[600]} size={24} />
              <Text style={styles.statNumber}>{profile.activeOrders}</Text>
              <Text style={styles.statLabel}>
                {userRole === 'farmer' ? 'Active Orders' : userRole === 'buyer' ? 'Active Purchases' : 'Active Shipments'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bio (for farmers) */}
        {userRole === 'farmer' && profile.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.bioCard}>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleRoleSwitch}>
              <Users color={Colors.primary[600]} size={20} />
              <Text style={styles.actionButtonText}>Switch Role (Demo)</Text>
            </TouchableOpacity>
            
            {userRole === 'farmer' && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/crops/add')}
              >
                <Package color={Colors.primary[600]} size={20} />
                <Text style={styles.actionButtonText}>Add New Crop</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/profile/verification')}
            >
              <Shield color={Colors.success[600]} size={20} />
              <Text style={styles.actionButtonText}>Verification Status</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color={Colors.error[500]} size={20} />
            <Text style={styles.logoutButtonText}>Logout</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  settingsButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  profileInfo: {
    alignItems: 'center',
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.success[700],
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  farmName: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary[200],
    marginTop: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  bioCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  bioText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.error[50],
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error[200],
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error[600],
  },
});