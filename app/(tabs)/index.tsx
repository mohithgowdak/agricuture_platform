import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Sprout, TrendingUp, Users, MessageCircle, Package, Building, Truck, Plus, Eye, Star } from 'lucide-react-native';
import { useUserRole } from '@/hooks/useUserRole';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { userRole } = useUserRole();

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'farmer':
        return {
          greeting: 'Good morning, Farmer',
          title: 'Welcome to your AgriConnect Dashboard',
          subtitle: 'Manage your crops and connect with buyers worldwide'
        };
      case 'buyer':
        return {
          greeting: 'Good morning, Buyer',
          title: 'Welcome to AgriConnect Marketplace',
          subtitle: 'Source quality crops from verified farmers globally'
        };
      case 'logistics':
        return {
          greeting: 'Good morning, Partner',
          title: 'Welcome to AgriConnect Logistics',
          subtitle: 'Connect farmers and buyers with your shipping services'
        };
      default:
        return {
          greeting: 'Good morning',
          title: 'Welcome to AgriConnect',
          subtitle: 'Your agricultural trade platform'
        };
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case 'farmer':
        return [
          {
            icon: Plus,
            title: 'Add New Crop',
            subtitle: 'List your harvest',
            color: Colors.primary[600],
            route: '/crops/add'
          },
          {
            icon: MessageCircle,
            title: 'Messages',
            subtitle: '3 new inquiries',
            color: Colors.accent[600],
            route: '/messages'
          },
          {
            icon: TrendingUp,
            title: 'Analytics',
            subtitle: 'View performance',
            color: Colors.secondary[600],
            route: '/analytics'
          },
          {
            icon: Users,
            title: 'Find Buyers',
            subtitle: 'Expand network',
            color: Colors.success[600],
            route: '/marketplace'
          }
        ];
      case 'buyer':
        return [
          {
            icon: Package,
            title: 'Browse Crops',
            subtitle: 'Find quality produce',
            color: Colors.primary[600],
            route: '/marketplace'
          },
          {
            icon: MessageCircle,
            title: 'Messages',
            subtitle: '5 conversations',
            color: Colors.accent[600],
            route: '/messages'
          },
          {
            icon: Users,
            title: 'Find Farmers',
            subtitle: 'Source directly',
            color: Colors.secondary[600],
            route: '/search'
          },
          {
            icon: Truck,
            title: 'Logistics',
            subtitle: 'Arrange shipping',
            color: Colors.warning[600],
            route: '/logistics'
          }
        ];
      case 'logistics':
        return [
          {
            icon: Package,
            title: 'Active Shipments',
            subtitle: '12 in progress',
            color: Colors.primary[600],
            route: '/shipments'
          },
          {
            icon: MessageCircle,
            title: 'Messages',
            subtitle: '8 new requests',
            color: Colors.accent[600],
            route: '/messages'
          },
          {
            icon: Users,
            title: 'Find Partners',
            subtitle: 'Expand network',
            color: Colors.secondary[600],
            route: '/marketplace'
          },
          {
            icon: TrendingUp,
            title: 'Performance',
            subtitle: 'View metrics',
            color: Colors.success[600],
            route: '/analytics'
          }
        ];
      default:
        return [];
    }
  };

  const getStats = () => {
    switch (userRole) {
      case 'farmer':
        return [
          { icon: Package, number: '12', label: 'Active Crops', color: Colors.primary[600] },
          { icon: TrendingUp, number: '8', label: 'Inquiries', color: Colors.accent[600] },
          { icon: Users, number: '156', label: 'Buyers Reached', color: Colors.secondary[600] }
        ];
      case 'buyer':
        return [
          { icon: Package, number: '45', label: 'Sourced Crops', color: Colors.primary[600] },
          { icon: Users, number: '23', label: 'Farmer Partners', color: Colors.accent[600] },
          { icon: Truck, number: '67', label: 'Shipments', color: Colors.secondary[600] }
        ];
      case 'logistics':
        return [
          { icon: Truck, number: '89', label: 'Deliveries', color: Colors.primary[600] },
          { icon: Users, number: '34', label: 'Partners', color: Colors.accent[600] },
          { icon: Package, number: '156', label: 'Tons Shipped', color: Colors.secondary[600] }
        ];
      default:
        return [
          { icon: Sprout, number: '12', label: 'Active Crops', color: Colors.primary[600] },
          { icon: TrendingUp, number: '8', label: 'Inquiries', color: Colors.accent[600] },
          { icon: Users, number: '156', label: 'Buyers', color: Colors.secondary[600] }
        ];
    }
  };

  const getRecentActivity = () => {
    switch (userRole) {
      case 'farmer':
        return [
          { title: 'New inquiry for Basmati Rice from Global Foods', time: '2 hours ago', type: 'inquiry' },
          { title: 'Wheat crop listing approved and published', time: '1 day ago', type: 'approval' },
          { title: 'Payment received for Cotton shipment', time: '2 days ago', type: 'payment' }
        ];
      case 'buyer':
        return [
          { title: 'New Basmati Rice listing from Green Valley Farm', time: '1 hour ago', type: 'listing' },
          { title: 'Shipment of Wheat arrived at warehouse', time: '4 hours ago', type: 'delivery' },
          { title: 'Quality report received for Cotton order', time: '1 day ago', type: 'report' }
        ];
      case 'logistics':
        return [
          { title: 'New shipping request from Mumbai to London', time: '30 min ago', type: 'request' },
          { title: 'Cotton shipment delivered successfully', time: '3 hours ago', type: 'delivery' },
          { title: 'New partnership inquiry from Global Foods', time: '6 hours ago', type: 'partnership' }
        ];
      default:
        return [
          { title: 'New inquiry for Rice crop', time: '2 hours ago', type: 'inquiry' },
          { title: 'Wheat crop listing approved', time: '1 day ago', type: 'approval' }
        ];
    }
  };

  const welcomeMessage = getWelcomeMessage();
  const quickActions = getQuickActions();
  const stats = getStats();
  const recentActivity = getRecentActivity();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{welcomeMessage.greeting}</Text>
              <Text style={styles.title}>{welcomeMessage.title}</Text>
              <Text style={styles.subtitle}>{welcomeMessage.subtitle}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.profileImage}
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <IconComponent color={stat.color} size={24} />
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.actionCard}
                  onPress={() => router.push(action.route as any)}
                >
                  <IconComponent color={action.color} size={32} />
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {recentActivity.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Role-specific insights */}
        {userRole === 'farmer' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Insights</Text>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <TrendingUp color={Colors.success[600]} size={24} />
                <Text style={styles.insightTitle}>Basmati Rice prices up 12%</Text>
              </View>
              <Text style={styles.insightText}>
                High demand from European markets is driving prices up. Consider listing your harvest now.
              </Text>
              <TouchableOpacity style={styles.insightButton}>
                <Text style={styles.insightButtonText}>View Market Trends</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {userRole === 'buyer' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Farmers</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationsScroll}>
              {[1, 2, 3].map((_, index) => (
                <TouchableOpacity key={index} style={styles.recommendationCard}>
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                    style={styles.recommendationImage}
                  />
                  <Text style={styles.recommendationName}>Green Valley Farm</Text>
                  <View style={styles.recommendationRating}>
                    <Star size={12} color={Colors.warning[500]} fill={Colors.warning[500]} />
                    <Text style={styles.recommendationRatingText}>4.8</Text>
                  </View>
                  <Text style={styles.recommendationCrop}>Organic Rice</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary[500],
    borderWidth: 2,
    borderColor: Colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
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
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  insightCard: {
    backgroundColor: Colors.success[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.success[200],
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success[800],
  },
  insightText: {
    fontSize: 14,
    color: Colors.success[700],
    lineHeight: 20,
    marginBottom: 12,
  },
  insightButton: {
    backgroundColor: Colors.success[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  insightButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.inverse,
  },
  recommendationsScroll: {
    flexDirection: 'row',
  },
  recommendationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 120,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    alignItems: 'center',
  },
  recommendationImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  recommendationRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  recommendationRatingText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  recommendationCrop: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});