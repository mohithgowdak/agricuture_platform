import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Search, Filter, MapPin, Star, Truck, Calendar, Package, Shield, Users, Building, Phone, Mail, Globe } from 'lucide-react-native';
import { useUserRole } from '@/hooks/useUserRole';

interface SearchResult {
  id: string;
  type: 'farmer' | 'buyer' | 'logistics';
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  profilePhoto: string;
  description: string;
  tags: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export default function SearchScreen() {
  const { userRole } = useUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'farmer' | 'buyer' | 'logistics'>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'nearby' | 'top-rated'>('all');

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'farmer',
      name: 'Green Valley Organic Farm',
      location: 'Punjab, India',
      rating: 4.8,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium organic rice and wheat producer with 15+ years experience',
      tags: ['Organic', 'Basmati Rice', 'Wheat', 'Sustainable'],
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'contact@greenvalley.com'
      }
    },
    {
      id: '2',
      type: 'buyer',
      name: 'Global Foods International',
      location: 'Mumbai, India',
      rating: 4.9,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Leading importer of premium agricultural products for European markets',
      tags: ['Premium Quality', 'European Markets', 'Bulk Orders', 'Long-term Contracts'],
      contactInfo: {
        phone: '+91 22 1234 5678',
        email: 'sourcing@globalfoods.com',
        website: 'www.globalfoods.com'
      }
    },
    {
      id: '3',
      type: 'logistics',
      name: 'Swift Cargo Solutions',
      location: 'Delhi, India',
      rating: 4.7,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Comprehensive logistics solutions for agricultural exports worldwide',
      tags: ['Cold Storage', 'International Shipping', 'Customs Clearance', 'Door-to-Door'],
      contactInfo: {
        phone: '+91 11 9876 5432',
        email: 'logistics@swiftcargo.com',
        website: 'www.swiftcargo.com'
      }
    },
    {
      id: '4',
      type: 'farmer',
      name: 'Sunrise Spice Plantation',
      location: 'Kerala, India',
      rating: 4.6,
      verified: true,
      profilePhoto: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Authentic spice cultivation using traditional methods',
      tags: ['Spices', 'Cardamom', 'Black Pepper', 'Traditional Methods'],
      contactInfo: {
        phone: '+91 98765 12345',
        email: 'info@sunrisespices.com'
      }
    }
  ];

  const filteredResults = mockResults.filter(result => {
    const matchesSearch = result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || result.type === selectedType;
    
    let matchesFilter = true;
    if (selectedFilter === 'verified') matchesFilter = result.verified;
    if (selectedFilter === 'top-rated') matchesFilter = result.rating >= 4.5;
    if (selectedFilter === 'nearby') matchesFilter = result.location.includes('India'); // Mock nearby filter
    
    return matchesSearch && matchesType && matchesFilter;
  });

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'farmer':
        return <Package color={Colors.primary[600]} size={20} />;
      case 'buyer':
        return <Building color={Colors.accent[600]} size={20} />;
      case 'logistics':
        return <Truck color={Colors.secondary[600]} size={20} />;
      default:
        return <Users color={Colors.neutral[500]} size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
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

  const handleContact = (result: SearchResult) => {
    // TODO: Implement contact functionality
    Alert.alert('Coming Soon', `Contact functionality for ${result.type} will be available soon!`);
    // router.push(`/contact/${result.type}/${result.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
          <Text style={styles.subtitle}>Find farmers, buyers, and logistics partners</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color={Colors.neutral[400]} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, location, or specialization..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
        </View>

        {/* Type Filter */}
        <View style={styles.typeFilterContainer}>
          <Text style={styles.filterTitle}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilter}>
            {[
              { key: 'all', label: 'All', icon: Users },
              { key: 'farmer', label: 'Farmers', icon: Package },
              { key: 'buyer', label: 'Buyers', icon: Building },
              { key: 'logistics', label: 'Logistics', icon: Truck }
            ].map((type) => {
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeTab,
                    selectedType === type.key && styles.typeTabActive
                  ]}
                  onPress={() => setSelectedType(type.key as any)}
                >
                  <IconComponent 
                    size={16} 
                    color={selectedType === type.key ? Colors.text.inverse : Colors.neutral[600]} 
                  />
                  <Text style={[
                    styles.typeTabText,
                    selectedType === type.key && styles.typeTabTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Additional Filters */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filters</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { key: 'all', label: 'All Results' },
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
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {filteredResults.length} Results {searchQuery && `for "${searchQuery}"`}
          </Text>

          {filteredResults.length === 0 ? (
            <View style={styles.noResults}>
              <Search color={Colors.neutral[400]} size={48} />
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try adjusting your search terms or filters
              </Text>
            </View>
          ) : (
            <View style={styles.resultsList}>
              {filteredResults.map((result) => (
                <TouchableOpacity key={result.id} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Image source={{ uri: result.profilePhoto }} style={styles.resultPhoto} />
                    <View style={styles.resultInfo}>
                      <View style={styles.resultNameRow}>
                        <Text style={styles.resultName}>{result.name}</Text>
                        {result.verified && (
                          <View style={styles.verifiedBadge}>
                            <Shield color={Colors.success[600]} size={12} />
                            <Text style={styles.verifiedText}>Verified</Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.resultTypeRow}>
                        {getTypeIcon(result.type)}
                        <Text style={[styles.resultType, { color: getTypeColor(result.type) }]}>
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </Text>
                      </View>

                      <View style={styles.locationRow}>
                        <MapPin color={Colors.neutral[500]} size={14} />
                        <Text style={styles.locationText}>{result.location}</Text>
                      </View>

                      <View style={styles.ratingRow}>
                        {renderStars(result.rating)}
                        <Text style={styles.ratingText}>{result.rating}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.resultDescription}>{result.description}</Text>

                  <View style={styles.tagsContainer}>
                    {result.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                    {result.tags.length > 3 && (
                      <Text style={styles.moreTags}>+{result.tags.length - 3} more</Text>
                    )}
                  </View>

                  <View style={styles.contactInfo}>
                    {result.contactInfo.phone && (
                      <View style={styles.contactItem}>
                        <Phone color={Colors.neutral[500]} size={14} />
                        <Text style={styles.contactText}>{result.contactInfo.phone}</Text>
                      </View>
                    )}
                    {result.contactInfo.email && (
                      <View style={styles.contactItem}>
                        <Mail color={Colors.neutral[500]} size={14} />
                        <Text style={styles.contactText}>{result.contactInfo.email}</Text>
                      </View>
                    )}
                    {result.contactInfo.website && (
                      <View style={styles.contactItem}>
                        <Globe color={Colors.neutral[500]} size={14} />
                        <Text style={styles.contactText}>{result.contactInfo.website}</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleContact(result)}
                  >
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  typeFilterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  typeFilter: {
    flexDirection: 'row',
  },
  typeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginRight: 8,
  },
  typeTabActive: {
    backgroundColor: Colors.primary[600],
  },
  typeTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  typeTabTextActive: {
    color: Colors.text.inverse,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: Colors.accent[600],
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  filterTabTextActive: {
    color: Colors.text.inverse,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  noResults: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    gap: 12,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  resultsList: {
    gap: 16,
  },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  resultHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  resultPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  resultInfo: {
    flex: 1,
    gap: 4,
  },
  resultNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.success[700],
  },
  resultTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultType: {
    fontSize: 14,
    fontWeight: '500',
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
  resultDescription: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary[700],
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 12,
    color: Colors.neutral[500],
    alignSelf: 'center',
  },
  contactInfo: {
    gap: 6,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 12,
    color: Colors.neutral[600],
  },
  contactButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});