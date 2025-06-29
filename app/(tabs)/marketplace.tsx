import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Search, Filter, MapPin, Star, Truck, Calendar, Package, Shield, Users, Building, Phone, Mail, Globe, MessageCircle } from 'lucide-react-native';
import { useUserRole } from '@/hooks/useUserRole';

interface Farmer {
  id: string;
  farmName: string;
  ownerName: string;
  location: string;
  rating: number;
  verified: boolean;
  profilePhoto: string;
  farmPhotos: string[];
  bio: string;
  yearsOperating: number;
  farmSizeHectares: number;
  crops: Crop[];
  certifications: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
}

interface Buyer {
  id: string;
  companyName: string;
  contactPerson: string;
  jobTitle: string;
  location: string;
  rating: number;
  verified: boolean;
  profilePhoto: string;
  companyLogo: string;
  description: string;
  interestedCrops: string[];
  requiredCertifications: string[];
  targetVolumePerYear: number;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
}

interface LogisticsPartner {
  id: string;
  companyName: string;
  contactPerson: string;
  location: string;
  rating: number;
  verified: boolean;
  profilePhoto: string;
  companyLogo: string;
  description: string;
  yearsInBusiness: number;
  servicesOffered: string[];
  transportModes: string[];
  specializations: string[];
  originCoverage: string[];
  destinationCoverage: string[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
}

interface Crop {
  id: string;
  name: string;
  variety: string;
  estimatedQuantityTons: number;
  expectedHarvestDate: string;
  pricePerTon: number;
  qualityGrade: string;
  photos: string[];
}

type TabType = 'farmers' | 'buyers' | 'logistics';

export default function MarketplaceScreen() {
  const { userRole } = useUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'nearby' | 'top-rated'>('all');
  const [activeTab, setActiveTab] = useState<TabType>('farmers');
  
  // Mock data for farmers with detailed profiles
  const mockFarmers: Farmer[] = [
    {
      id: '1',
      farmName: 'Green Valley Organic Farm',
      ownerName: 'Rajesh Kumar',
      location: 'Punjab, India',
      rating: 4.8,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
      farmPhotos: [
        'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      bio: 'Organic farming specialist with 15+ years experience in sustainable agriculture. We focus on premium quality crops using traditional methods combined with modern techniques.',
      yearsOperating: 15,
      farmSizeHectares: 50,
      certifications: ['USDA Organic', 'Fair Trade', 'Global G.A.P.'],
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'rajesh@greenvalley.com'
      },
      crops: [
        {
          id: '1',
          name: 'Basmati Rice',
          variety: 'Pusa Basmati 1121',
          estimatedQuantityTons: 50,
          expectedHarvestDate: '2024-03-15',
          pricePerTon: 1200,
          qualityGrade: 'Grade A',
          photos: ['https://images.pexels.com/photos/33239/wheat-field-wheat-yellow-grain.jpg?auto=compress&cs=tinysrgb&w=400']
        }
      ]
    },
    {
      id: '2',
      farmName: 'Sunrise Spice Plantation',
      ownerName: 'Priya Nair',
      location: 'Kerala, India',
      rating: 4.9,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
      farmPhotos: [
        'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      bio: 'Third-generation spice farmers specializing in premium cardamom and black pepper. Our plantation follows traditional Kerala farming methods.',
      yearsOperating: 25,
      farmSizeHectares: 30,
      certifications: ['Organic India', 'Spices Board Certification'],
      contactInfo: {
        phone: '+91 98765 12345',
        email: 'priya@sunrisespices.com'
      },
      crops: [
        {
          id: '2',
          name: 'Cardamom',
          variety: 'Malabar',
          estimatedQuantityTons: 5,
          expectedHarvestDate: '2024-04-10',
          pricePerTon: 15000,
          qualityGrade: 'Premium',
          photos: ['https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400']
        }
      ]
    }
  ];

  // Mock data for buyers with detailed profiles
  const mockBuyers: Buyer[] = [
    {
      id: '1',
      companyName: 'Global Foods International',
      contactPerson: 'James Wilson',
      jobTitle: 'Sourcing Manager',
      location: 'Mumbai, India',
      rating: 4.9,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      companyLogo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Leading importer of premium agricultural products for European markets. We specialize in organic and sustainably sourced crops.',
      interestedCrops: ['Basmati Rice', 'Organic Spices', 'Premium Wheat'],
      requiredCertifications: ['USDA Organic', 'Fair Trade'],
      targetVolumePerYear: 1000,
      contactInfo: {
        phone: '+91 22 1234 5678',
        email: 'james@globalfoods.com',
        website: 'www.globalfoods.com'
      }
    },
    {
      id: '2',
      companyName: 'European Grain Traders',
      contactPerson: 'Maria Schmidt',
      jobTitle: 'Head of Procurement',
      location: 'London, UK',
      rating: 4.7,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      companyLogo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Established grain trading company serving European markets for over 30 years. We focus on premium quality grains and cereals.',
      interestedCrops: ['Premium Basmati', 'Organic Wheat', 'Quinoa'],
      requiredCertifications: ['EU Organic', 'Global G.A.P.'],
      targetVolumePerYear: 2500,
      contactInfo: {
        phone: '+44 20 1234 5678',
        email: 'maria@europeangrains.com',
        website: 'www.europeangrains.com'
      }
    }
  ];

  // Mock data for logistics partners with detailed profiles
  const mockLogistics: LogisticsPartner[] = [
    {
      id: '1',
      companyName: 'Swift Cargo Solutions',
      contactPerson: 'Amit Sharma',
      location: 'Delhi, India',
      rating: 4.8,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=400',
      companyLogo: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Comprehensive logistics solutions for agricultural exports worldwide. We specialize in temperature-controlled transportation.',
      yearsInBusiness: 12,
      servicesOffered: ['Freight Forwarding', 'Customs Clearance', 'Warehousing', 'Cold Storage'],
      transportModes: ['Ocean Freight', 'Air Freight', 'Road Transport'],
      specializations: ['Temperature Controlled', 'Perishables', 'Bulk Grains'],
      originCoverage: ['India - All Major Ports', 'Pakistan', 'Bangladesh'],
      destinationCoverage: ['Europe', 'Middle East', 'USA', 'Southeast Asia'],
      contactInfo: {
        phone: '+91 11 9876 5432',
        email: 'amit@swiftcargo.com',
        website: 'www.swiftcargo.com'
      }
    },
    {
      id: '2',
      companyName: 'Global Freight Express',
      contactPerson: 'Sarah Johnson',
      location: 'Chennai, India',
      rating: 4.6,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=400',
      companyLogo: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'International freight forwarding company with expertise in agricultural commodity shipping. Door-to-door service worldwide.',
      yearsInBusiness: 18,
      servicesOffered: ['Sea Freight', 'Air Freight', 'Door-to-Door', 'Insurance'],
      transportModes: ['Ocean Freight', 'Air Freight', 'Multimodal'],
      specializations: ['Containerized Cargo', 'Break Bulk', 'Project Cargo'],
      originCoverage: ['India', 'Sri Lanka', 'Maldives'],
      destinationCoverage: ['Worldwide'],
      contactInfo: {
        phone: '+91 44 8765 4321',
        email: 'sarah@globalfreight.com',
        website: 'www.globalfreight.com'
      }
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        color={i < Math.floor(rating) ? Colors.warning[500] : Colors.neutral[300]}
        fill={i < Math.floor(rating) ? Colors.warning[500] : 'transparent'}
      />
    ));
  };

  const handleContact = (type: string, id: string, name: string) => {
    // In a real app, this would open a conversation or contact form
    router.push(`/messages`);
  };

  const renderFarmers = () => (
    <View style={styles.itemsContainer}>
      {mockFarmers.map((farmer) => (
        <TouchableOpacity key={farmer.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Image source={{ uri: farmer.profilePhoto }} style={styles.itemPhoto} />
            <View style={styles.itemInfo}>
              <View style={styles.itemNameRow}>
                <Text style={styles.itemName}>{farmer.farmName}</Text>
                {farmer.verified && (
                  <View style={styles.verifiedBadge}>
                    <Shield color={Colors.success[600]} size={14} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <Text style={styles.ownerName}>by {farmer.ownerName}</Text>
              <View style={styles.locationRow}>
                <MapPin color={Colors.neutral[500]} size={14} />
                <Text style={styles.locationText}>{farmer.location}</Text>
              </View>
              <View style={styles.ratingRow}>
                {renderStars(farmer.rating)}
                <Text style={styles.ratingText}>{farmer.rating}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.bioText} numberOfLines={2}>{farmer.bio}</Text>

          <View style={styles.farmDetails}>
            <View style={styles.farmDetail}>
              <Text style={styles.farmDetailLabel}>Experience:</Text>
              <Text style={styles.farmDetailValue}>{farmer.yearsOperating} years</Text>
            </View>
            <View style={styles.farmDetail}>
              <Text style={styles.farmDetailLabel}>Farm Size:</Text>
              <Text style={styles.farmDetailValue}>{farmer.farmSizeHectares} hectares</Text>
            </View>
          </View>

          <View style={styles.certificationsContainer}>
            <Text style={styles.certificationsTitle}>Certifications:</Text>
            <View style={styles.certificationsTags}>
              {farmer.certifications.slice(0, 2).map((cert, index) => (
                <View key={index} style={styles.certificationTag}>
                  <Text style={styles.certificationTagText}>{cert}</Text>
                </View>
              ))}
              {farmer.certifications.length > 2 && (
                <Text style={styles.moreCertifications}>+{farmer.certifications.length - 2}</Text>
              )}
            </View>
          </View>

          <View style={styles.cropsContainer}>
            <Text style={styles.cropsTitle}>Available Crops:</Text>
            {farmer.crops.map((crop) => (
              <View key={crop.id} style={styles.cropCard}>
                <Image source={{ uri: crop.photos[0] }} style={styles.cropImage} />
                <View style={styles.cropInfo}>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  <Text style={styles.cropVariety}>{crop.variety}</Text>
                  <View style={styles.cropDetails}>
                    <View style={styles.cropDetail}>
                      <Package color={Colors.neutral[500]} size={12} />
                      <Text style={styles.cropDetailText}>{crop.estimatedQuantityTons} tons</Text>
                    </View>
                    <View style={styles.cropDetail}>
                      <Calendar color={Colors.neutral[500]} size={12} />
                      <Text style={styles.cropDetailText}>{crop.expectedHarvestDate}</Text>
                    </View>
                  </View>
                  <Text style={styles.cropPrice}>${crop.pricePerTon}/ton</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.contactActions}>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContact('farmer', farmer.id, farmer.farmName)}
            >
              <MessageCircle color={Colors.text.inverse} size={16} />
              <Text style={styles.contactButtonText}>Message Farmer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.phoneButton}>
              <Phone color={Colors.primary[600]} size={16} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBuyers = () => (
    <View style={styles.itemsContainer}>
      {mockBuyers.map((buyer) => (
        <TouchableOpacity key={buyer.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Image source={{ uri: buyer.companyLogo }} style={styles.itemPhoto} />
            <View style={styles.itemInfo}>
              <View style={styles.itemNameRow}>
                <Text style={styles.itemName}>{buyer.companyName}</Text>
                {buyer.verified && (
                  <View style={styles.verifiedBadge}>
                    <Shield color={Colors.success[600]} size={14} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <Text style={styles.contactPersonText}>{buyer.contactPerson} - {buyer.jobTitle}</Text>
              <View style={styles.locationRow}>
                <MapPin color={Colors.neutral[500]} size={14} />
                <Text style={styles.locationText}>{buyer.location}</Text>
              </View>
              <View style={styles.ratingRow}>
                {renderStars(buyer.rating)}
                <Text style={styles.ratingText}>{buyer.rating}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.bioText} numberOfLines={2}>{buyer.description}</Text>

          <View style={styles.buyerDetails}>
            <View style={styles.buyerDetail}>
              <Text style={styles.buyerDetailLabel}>Annual Volume:</Text>
              <Text style={styles.buyerDetailValue}>{buyer.targetVolumePerYear} tons</Text>
            </View>
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Looking for:</Text>
            <View style={styles.requirementsTags}>
              {buyer.interestedCrops.map((crop, index) => (
                <View key={index} style={styles.requirementTag}>
                  <Text style={styles.requirementTagText}>{crop}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.certificationsContainer}>
            <Text style={styles.certificationsTitle}>Required Certifications:</Text>
            <View style={styles.certificationsTags}>
              {buyer.requiredCertifications.map((cert, index) => (
                <View key={index} style={styles.certificationTag}>
                  <Text style={styles.certificationTagText}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.contactActions}>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContact('buyer', buyer.id, buyer.companyName)}
            >
              <MessageCircle color={Colors.text.inverse} size={16} />
              <Text style={styles.contactButtonText}>Message Buyer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.phoneButton}>
              <Phone color={Colors.primary[600]} size={16} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLogistics = () => (
    <View style={styles.itemsContainer}>
      {mockLogistics.map((logistics) => (
        <TouchableOpacity key={logistics.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Image source={{ uri: logistics.companyLogo }} style={styles.itemPhoto} />
            <View style={styles.itemInfo}>
              <View style={styles.itemNameRow}>
                <Text style={styles.itemName}>{logistics.companyName}</Text>
                {logistics.verified && (
                  <View style={styles.verifiedBadge}>
                    <Shield color={Colors.success[600]} size={14} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <Text style={styles.contactPersonText}>{logistics.contactPerson}</Text>
              <View style={styles.locationRow}>
                <MapPin color={Colors.neutral[500]} size={14} />
                <Text style={styles.locationText}>{logistics.location}</Text>
              </View>
              <View style={styles.ratingRow}>
                {renderStars(logistics.rating)}
                <Text style={styles.ratingText}>{logistics.rating}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.bioText} numberOfLines={2}>{logistics.description}</Text>

          <View style={styles.logisticsDetails}>
            <View style={styles.logisticsDetail}>
              <Text style={styles.logisticsDetailLabel}>Experience:</Text>
              <Text style={styles.logisticsDetailValue}>{logistics.yearsInBusiness} years</Text>
            </View>
          </View>

          <View style={styles.servicesContainer}>
            <Text style={styles.servicesTitle}>Services:</Text>
            <View style={styles.servicesTags}>
              {logistics.servicesOffered.slice(0, 3).map((service, index) => (
                <View key={index} style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>{service}</Text>
                </View>
              ))}
              {logistics.servicesOffered.length > 3 && (
                <Text style={styles.moreServices}>+{logistics.servicesOffered.length - 3}</Text>
              )}
            </View>
          </View>

          <View style={styles.coverageContainer}>
            <Text style={styles.coverageTitle}>Coverage:</Text>
            <Text style={styles.coverageText}>
              From: {logistics.originCoverage.slice(0, 2).join(', ')}
              {logistics.originCoverage.length > 2 && ` +${logistics.originCoverage.length - 2} more`}
            </Text>
            <Text style={styles.coverageText}>
              To: {logistics.destinationCoverage.slice(0, 2).join(', ')}
              {logistics.destinationCoverage.length > 2 && ` +${logistics.destinationCoverage.length - 2} more`}
            </Text>
          </View>

          <View style={styles.contactActions}>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContact('logistics', logistics.id, logistics.companyName)}
            >
              <MessageCircle color={Colors.text.inverse} size={16} />
              <Text style={styles.contactButtonText}>Get Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.phoneButton}>
              <Phone color={Colors.primary[600]} size={16} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const getTitle = () => {
    if (userRole === 'farmer') return 'Find Buyers & Logistics';
    if (userRole === 'buyer') return 'Find Farmers & Logistics';
    if (userRole === 'logistics') return 'Find Farmers & Buyers';
    return 'Marketplace';
  };

  const getSubtitle = () => {
    if (userRole === 'farmer') return 'Connect with buyers and logistics partners for your crops';
    if (userRole === 'buyer') return 'Source quality crops from verified farmers worldwide';
    if (userRole === 'logistics') return 'Connect with farmers and buyers for shipping opportunities';
    return 'Connect with the global agricultural community';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'farmers':
        return renderFarmers();
      case 'buyers':
        return renderBuyers();
      case 'logistics':
        return renderLogistics();
      default:
        return renderFarmers();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/buyer/register')}
          >
            <Building color={Colors.accent[600]} size={24} />
            <Text style={styles.actionText}>Become a Buyer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/logistics/register')}
          >
            <Truck color={Colors.secondary[600]} size={24} />
            <Text style={styles.actionText}>Join as Logistics Partner</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color={Colors.neutral[400]} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, location, crops, or services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {[
            { key: 'all', label: 'All' },
            { key: 'verified', label: 'Verified Only' },
            { key: 'top-rated', label: 'Top Rated' },
            { key: 'nearby', label: 'Nearby' }
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter.key && styles.filterTabTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Horizontal Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'farmers' && styles.tabActive]}
            onPress={() => setActiveTab('farmers')}
          >
            <Package color={activeTab === 'farmers' ? Colors.primary[600] : Colors.neutral[500]} size={20} />
            <Text style={[
              styles.tabText,
              activeTab === 'farmers' && styles.tabTextActive
            ]}>
              Farmers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'buyers' && styles.tabActive]}
            onPress={() => setActiveTab('buyers')}
          >
            <Building color={activeTab === 'buyers' ? Colors.accent[600] : Colors.neutral[500]} size={20} />
            <Text style={[
              styles.tabText,
              activeTab === 'buyers' && styles.tabTextActive
            ]}>
              Buyers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'logistics' && styles.tabActive]}
            onPress={() => setActiveTab('logistics')}
          >
            <Truck color={activeTab === 'logistics' ? Colors.secondary[600] : Colors.neutral[500]} size={20} />
            <Text style={[
              styles.tabText,
              activeTab === 'logistics' && styles.tabTextActive
            ]}>
              Logistics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
  },
  filterTabActive: {
    backgroundColor: Colors.primary[600],
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  filterTabTextActive: {
    color: Colors.text.inverse,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.background,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[500],
  },
  tabTextActive: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  itemsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  itemHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  itemPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  ownerName: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  contactPersonText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.success[700],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  bioText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
    marginBottom: 12,
  },
  farmDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  farmDetail: {
    flex: 1,
  },
  farmDetailLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  farmDetailValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  buyerDetails: {
    marginBottom: 12,
  },
  buyerDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyerDetailLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  buyerDetailValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  logisticsDetails: {
    marginBottom: 12,
  },
  logisticsDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logisticsDetailLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  logisticsDetailValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  certificationsContainer: {
    marginBottom: 12,
  },
  certificationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  certificationsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  certificationTag: {
    backgroundColor: Colors.success[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success[200],
  },
  certificationTagText: {
    fontSize: 12,
    color: Colors.success[700],
    fontWeight: '500',
  },
  moreCertifications: {
    fontSize: 12,
    color: Colors.neutral[500],
    alignSelf: 'center',
  },
  cropsContainer: {
    marginBottom: 12,
  },
  cropsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  cropCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  cropImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cropInfo: {
    flex: 1,
    gap: 4,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  cropVariety: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  cropDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  cropDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cropDetailText: {
    fontSize: 12,
    color: Colors.neutral[500],
  },
  cropPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary[600],
  },
  requirementsContainer: {
    marginBottom: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  requirementsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  requirementTag: {
    backgroundColor: Colors.accent[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent[200],
  },
  requirementTagText: {
    fontSize: 12,
    color: Colors.accent[700],
    fontWeight: '500',
  },
  servicesContainer: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  servicesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    backgroundColor: Colors.secondary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary[200],
  },
  serviceTagText: {
    fontSize: 12,
    color: Colors.secondary[700],
    fontWeight: '500',
  },
  moreServices: {
    fontSize: 12,
    color: Colors.neutral[500],
    alignSelf: 'center',
  },
  coverageContainer: {
    marginBottom: 12,
  },
  coverageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  coverageText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    paddingVertical: 12,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  phoneButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
});