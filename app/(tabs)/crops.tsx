import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Package, Plus, Calendar, MapPin, DollarSign, Eye, CreditCard as Edit, Trash2, TrendingUp, Users, Clock } from 'lucide-react-native';

interface Crop {
  id: string;
  name: string;
  variety: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  harvestDate: string;
  plantingDate: string;
  status: 'growing' | 'ready' | 'harvested' | 'sold';
  location: string;
  photos: string[];
  description: string;
  views: number;
  inquiries: number;
}

export default function CropsScreen() {
  const [crops, setCrops] = useState<Crop[]>([
    {
      id: '1',
      name: 'Basmati Rice',
      variety: 'Pusa Basmati 1121',
      quantity: 50,
      unit: 'tons',
      pricePerUnit: 1200,
      harvestDate: '2024-03-15',
      plantingDate: '2023-11-20',
      status: 'ready',
      location: 'Field A, Punjab',
      photos: ['https://images.pexels.com/photos/33239/wheat-field-wheat-yellow-grain.jpg?auto=compress&cs=tinysrgb&w=400'],
      description: 'Premium quality Basmati rice grown using organic methods',
      views: 156,
      inquiries: 12
    },
    {
      id: '2',
      name: 'Wheat',
      variety: 'HD 2967',
      quantity: 75,
      unit: 'tons',
      pricePerUnit: 800,
      harvestDate: '2024-04-20',
      plantingDate: '2023-12-01',
      status: 'growing',
      location: 'Field B, Punjab',
      photos: ['https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=400'],
      description: 'High-yield wheat variety suitable for bread making',
      views: 89,
      inquiries: 7
    },
    {
      id: '3',
      name: 'Cotton',
      variety: 'Bt Cotton',
      quantity: 30,
      unit: 'tons',
      pricePerUnit: 1500,
      harvestDate: '2024-05-10',
      plantingDate: '2024-01-15',
      status: 'growing',
      location: 'Field C, Gujarat',
      photos: ['https://images.pexels.com/photos/207247/pexels-photo-207247.jpeg?auto=compress&cs=tinysrgb&w=400'],
      description: 'Premium cotton with excellent fiber quality',
      views: 234,
      inquiries: 18
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing':
        return Colors.warning[500];
      case 'ready':
        return Colors.success[500];
      case 'harvested':
        return Colors.primary[500];
      case 'sold':
        return Colors.neutral[500];
      default:
        return Colors.neutral[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'growing':
        return 'Growing';
      case 'ready':
        return 'Ready for Harvest';
      case 'harvested':
        return 'Harvested';
      case 'sold':
        return 'Sold';
      default:
        return status;
    }
  };

  const handleAddCrop = () => {
    router.push('/crops/add');
  };

  const handleEditCrop = (cropId: string) => {
    router.push(`/crops/edit/${cropId}`);
  };

  const handleViewCrop = (cropId: string) => {
    router.push(`/crops/view/${cropId}`);
  };

  const handleDeleteCrop = (cropId: string) => {
    Alert.alert(
      'Delete Crop',
      'Are you sure you want to delete this crop listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setCrops(crops.filter(crop => crop.id !== cropId));
          }
        }
      ]
    );
  };

  const totalQuantity = crops.reduce((sum, crop) => sum + crop.quantity, 0);
  const totalValue = crops.reduce((sum, crop) => sum + (crop.quantity * crop.pricePerUnit), 0);
  const totalViews = crops.reduce((sum, crop) => sum + crop.views, 0);
  const totalInquiries = crops.reduce((sum, crop) => sum + crop.inquiries, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>My Crops</Text>
              <Text style={styles.subtitle}>Manage your crop listings</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCrop}>
              <Plus color={Colors.text.inverse} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Package color={Colors.primary[600]} size={24} />
            <Text style={styles.statNumber}>{crops.length}</Text>
            <Text style={styles.statLabel}>Total Crops</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp color={Colors.accent[600]} size={24} />
            <Text style={styles.statNumber}>{totalQuantity}</Text>
            <Text style={styles.statLabel}>Total Tons</Text>
          </View>
          <View style={styles.statCard}>
            <DollarSign color={Colors.success[600]} size={24} />
            <Text style={styles.statNumber}>${(totalValue / 1000).toFixed(0)}K</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.performanceContainer}>
          <View style={styles.performanceCard}>
            <Eye color={Colors.neutral[500]} size={20} />
            <Text style={styles.performanceNumber}>{totalViews}</Text>
            <Text style={styles.performanceLabel}>Total Views</Text>
          </View>
          <View style={styles.performanceCard}>
            <Users color={Colors.neutral[500]} size={20} />
            <Text style={styles.performanceNumber}>{totalInquiries}</Text>
            <Text style={styles.performanceLabel}>Inquiries</Text>
          </View>
        </View>

        {/* Crops List */}
        <View style={styles.cropsContainer}>
          <Text style={styles.sectionTitle}>Your Crops</Text>
          
          {crops.length === 0 ? (
            <View style={styles.emptyCrops}>
              <Package color={Colors.neutral[400]} size={48} />
              <Text style={styles.emptyTitle}>No crops listed yet</Text>
              <Text style={styles.emptySubtitle}>Add your first crop to start connecting with buyers</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleAddCrop}>
                <Plus color={Colors.text.inverse} size={20} />
                <Text style={styles.emptyButtonText}>Add Your First Crop</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cropsList}>
              {crops.map((crop) => (
                <View key={crop.id} style={styles.cropCard}>
                  <TouchableOpacity onPress={() => handleViewCrop(crop.id)}>
                    <Image source={{ uri: crop.photos[0] }} style={styles.cropImage} />
                    
                    <View style={styles.cropContent}>
                      <View style={styles.cropHeader}>
                        <View style={styles.cropTitleContainer}>
                          <Text style={styles.cropName}>{crop.name}</Text>
                          <Text style={styles.cropVariety}>{crop.variety}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(crop.status) + '20' }]}>
                          <Text style={[styles.statusText, { color: getStatusColor(crop.status) }]}>
                            {getStatusText(crop.status)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.cropDetails}>
                        <View style={styles.cropDetail}>
                          <Package color={Colors.neutral[500]} size={16} />
                          <Text style={styles.cropDetailText}>{crop.quantity} {crop.unit}</Text>
                        </View>
                        <View style={styles.cropDetail}>
                          <DollarSign color={Colors.neutral[500]} size={16} />
                          <Text style={styles.cropDetailText}>${crop.pricePerUnit}/{crop.unit}</Text>
                        </View>
                      </View>

                      <View style={styles.cropDetails}>
                        <View style={styles.cropDetail}>
                          <Calendar color={Colors.neutral[500]} size={16} />
                          <Text style={styles.cropDetailText}>Harvest: {crop.harvestDate}</Text>
                        </View>
                        <View style={styles.cropDetail}>
                          <MapPin color={Colors.neutral[500]} size={16} />
                          <Text style={styles.cropDetailText}>{crop.location}</Text>
                        </View>
                      </View>

                      <View style={styles.cropStats}>
                        <View style={styles.cropStat}>
                          <Eye color={Colors.neutral[400]} size={14} />
                          <Text style={styles.cropStatText}>{crop.views} views</Text>
                        </View>
                        <View style={styles.cropStat}>
                          <Users color={Colors.neutral[400]} size={14} />
                          <Text style={styles.cropStatText}>{crop.inquiries} inquiries</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.cropActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleViewCrop(crop.id)}
                    >
                      <Eye color={Colors.primary[600]} size={16} />
                      <Text style={styles.actionButtonText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditCrop(crop.id)}
                    >
                      <Edit color={Colors.accent[600]} size={16} />
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteCrop(crop.id)}
                    >
                      <Trash2 color={Colors.error[500]} size={16} />
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
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
  performanceContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    gap: 8,
  },
  performanceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  performanceLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  cropsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  emptyCrops: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  cropsList: {
    gap: 16,
  },
  cropCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    overflow: 'hidden',
  },
  cropImage: {
    width: '100%',
    height: 200,
  },
  cropContent: {
    padding: 16,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cropTitleContainer: {
    flex: 1,
  },
  cropName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  cropVariety: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cropDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  cropDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cropDetailText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cropStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  cropStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cropStatText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  cropActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.neutral[200],
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
});