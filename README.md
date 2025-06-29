# 🌾 AgriConnect - Agricultural Trade Platform

A comprehensive mobile-first agricultural trade platform built with Expo Router, React Native, and Supabase. AgriConnect connects farmers directly with global buyers and logistics partners, eliminating middlemen and maximizing profits.

## 📱 Platform Overview

AgriConnect is a multi-role platform supporting:
- **🚜 Farmers**: List crops, manage inventory, connect with buyers
- **🏢 Buyers**: Source quality crops, manage suppliers, track orders
- **🚛 Logistics Partners**: Provide shipping services, manage deliveries

## 🏗️ Project Architecture

### Technology Stack
- **Frontend**: React Native with Expo Router 4.0.17
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Navigation**: Expo Router with Tab-based architecture
- **Styling**: StyleSheet.create (no external CSS frameworks)
- **Icons**: Lucide React Native
- **Platform**: Web-first with mobile compatibility

### Project Structure
```
agriconnect/
├── app/                          # All routes and screens
│   ├── _layout.tsx              # Root layout with Stack navigator
│   ├── index.tsx                # App entry point with auth check
│   ├── (tabs)/                  # Main tab navigation
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home dashboard
│   │   ├── search.tsx           # Global search
│   │   ├── marketplace.tsx      # Browse farmers/buyers/logistics
│   │   ├── crops.tsx            # Farmer crop management
│   │   ├── messages.tsx         # Chat system
│   │   └── profile.tsx          # User profile management
│   ├── auth/                    # Authentication flows
│   │   └── verify.tsx           # Phone/Email verification
│   ├── onboarding/              # User onboarding
│   │   ├── welcome.tsx          # Welcome screen
│   │   ├── role-selection.tsx   # Choose user role
│   │   ├── profile-setup.tsx    # Farmer profile creation
│   │   └── verification.tsx     # Document verification
│   ├── buyer/                   # Buyer-specific flows
│   │   └── register.tsx         # Buyer registration
│   └── logistics/               # Logistics-specific flows
│       └── register.tsx         # Logistics registration
├── components/                   # Reusable UI components
│   ├── ImagePicker.tsx          # Image selection component
│   ├── DocumentPicker.tsx       # Document upload component
│   └── PhoneInput.tsx           # Phone number input
├── lib/                         # Core utilities and services
│   ├── supabase.ts             # Supabase client configuration
│   ├── storage.ts              # File upload utilities
│   ├── freeOtpService.ts       # OTP verification service
│   └── i18n.ts                 # Internationalization
├── hooks/                       # Custom React hooks
│   ├── useFrameworkReady.ts    # Framework initialization
│   └── useUserRole.ts          # User role management
├── constants/                   # App constants
│   └── Colors.ts               # Color system
├── types/                       # TypeScript definitions
│   └── database.ts             # Supabase database types
└── docs/                        # Documentation
    ├── SUPABASE_SETUP_COMPLETE.md
    ├── VERIFICATION_SETUP.md
    └── STORAGE_SETUP_GUIDE.md
```

## 🎨 Design System

### Color Palette
```typescript
// Primary - Trust and Growth
primary: {
  50: '#f0fdf4',   // Light green backgrounds
  500: '#22c55e',  // Main brand green
  600: '#16a34a',  // Primary buttons
  700: '#15803d',  // Hover states
}

// Secondary - Earth and Agriculture
secondary: {
  500: '#eab308',  // Golden wheat
  600: '#ca8a04',  // Accent elements
}

// Accent - Professional Trust
accent: {
  500: '#3b82f6',  // Professional blue
  600: '#2563eb',  // Links and actions
}
```

### Typography
- **Headings**: Bold weights (600-700)
- **Body Text**: Regular weight (400)
- **Captions**: Light weight (300)
- **Line Heights**: 150% for body, 120% for headings

### Spacing System
- **Base Unit**: 8px
- **Component Padding**: 16px, 20px, 24px
- **Section Margins**: 24px, 32px
- **Border Radius**: 8px, 12px, 16px

## 📱 App Structure & Navigation

### Root Layout (`app/_layout.tsx`)
- **Purpose**: Main app wrapper with Stack navigator
- **Key Features**:
  - Framework initialization with `useFrameworkReady()`
  - Status bar configuration
  - Global navigation setup
- **Critical**: Never modify the `useFrameworkReady()` hook

### Entry Point (`app/index.tsx`)
- **Purpose**: Authentication check and routing logic
- **Flow**:
  1. Check for demo session in localStorage
  2. Validate Supabase session
  3. Route to appropriate screen based on auth status
- **Routes To**:
  - `/auth/verify` - New users
  - `/onboarding/welcome` - Authenticated but incomplete profile
  - `/(tabs)` - Complete users

### Tab Navigation (`app/(tabs)/_layout.tsx`)
- **Purpose**: Main app navigation with role-based tabs
- **Dynamic Tabs**: Adapts based on user role
- **Common Tabs**: Home, Search, Marketplace, Messages, Profile
- **Role-Specific**: "My Crops" tab only for farmers

## 🔐 Authentication System

### Verification Flow (`app/auth/verify.tsx`)
- **Methods**: Email OTP and SMS OTP
- **Services**: 
  - TextBelt (1 free SMS/day)
  - Console/Alert fallback for demo
  - Email via Supabase Auth
- **Security**: 5-minute expiration, 3 attempt limit

### OTP Service (`lib/freeOtpService.ts`)
- **Features**:
  - Multi-provider SMS support
  - Email verification
  - In-memory storage (demo) / Redis (production)
  - Automatic cleanup
- **Providers**: TextBelt, SendGrid, Mailgun

## 👥 User Roles & Onboarding

### Role Selection (`app/onboarding/role-selection.tsx`)
- **Roles**: Farmer, Buyer, Logistics Partner
- **Features**: Role-specific benefits display
- **Navigation**: Routes to appropriate registration flow

### Farmer Onboarding
1. **Welcome** (`app/onboarding/welcome.tsx`)
2. **Role Selection** (`app/onboarding/role-selection.tsx`)
3. **Profile Setup** (`app/onboarding/profile-setup.tsx`)
4. **Verification** (`app/onboarding/verification.tsx`)

### Buyer Registration (`app/buyer/register.tsx`)
- **Steps**: Personal Info → Company Details → Subscription
- **Plans**: Basic ($99), Premium ($299), Enterprise ($999)
- **Features**: Multi-step form with validation

### Logistics Registration (`app/logistics/register.tsx`)
- **Steps**: Company Info → Services → Verification
- **Services**: Road, Sea, Air transport, Warehousing
- **Coverage**: Operating regions and specializations

## 🏠 Main App Screens

### Home Dashboard (`app/(tabs)/index.tsx`)
- **Role-Adaptive**: Different content per user role
- **Features**:
  - Welcome message and user info
  - Statistics cards
  - Quick actions
  - Recent activity
  - Role-specific insights
- **Farmer View**: Crop stats, market insights
- **Buyer View**: Sourcing stats, recommended farmers
- **Logistics View**: Shipment stats, partnership opportunities

### Search (`app/(tabs)/search.tsx`)
- **Purpose**: Global search across all entity types
- **Features**:
  - Type filters (Farmers, Buyers, Logistics)
  - Advanced filters (Verified, Top-rated, Nearby)
  - Rich result cards with contact info
  - Direct contact actions

### Marketplace (`app/(tabs)/marketplace.tsx`)
- **Layout**: Horizontal tabs for entity types
- **Features**:
  - Detailed profiles with comprehensive info
  - Service offerings and specializations
  - Contact actions and messaging
  - Verification badges
- **Farmer Profiles**: Farm details, crops, certifications
- **Buyer Profiles**: Company info, requirements, volume
- **Logistics Profiles**: Services, coverage, experience

### Crop Management (`app/(tabs)/crops.tsx`)
- **Farmer-Only**: Only visible to farmers
- **Features**:
  - Crop listing with photos and details
  - Status management (Growing, Ready, Harvested, Sold)
  - Performance statistics
  - CRUD operations (Create, Read, Update, Delete)
  - View/Edit/Delete actions

### Messages (`app/(tabs)/messages.tsx`)
- **Features**:
  - Conversation list with participant types
  - Real-time chat interface
  - Online status indicators
  - Message threading
  - Contact actions (call, video)
- **Participants**: Identified by role icons
- **Demo**: Mock conversations with different entity types

### Profile (`app/(tabs)/profile.tsx`)
- **Role-Adaptive**: Different content per user role
- **Features**:
  - Profile photo and basic info
  - Contact information
  - Role-specific statistics
  - Quick actions
  - Role switching (demo)
  - Settings and logout

## 🧩 Reusable Components

### ImagePicker (`components/ImagePicker.tsx`)
- **Purpose**: Image selection and upload
- **Features**:
  - Web file picker integration
  - Image preview
  - File validation (size, type)
  - Remove/change functionality
- **Usage**: Profile photos, crop images

### DocumentPicker (`components/DocumentPicker.tsx`)
- **Purpose**: Document upload for verification
- **Features**:
  - File type validation
  - Size limits
  - Upload progress
  - Required/optional indicators
- **Usage**: ID documents, farm ownership papers

### PhoneInput (`components/PhoneInput.tsx`)
- **Purpose**: International phone number input
- **Features**: Country code selection, validation
- **Status**: Placeholder (not implemented)

## 🗄️ Database Schema

### Core Tables
- **users**: Basic user information and roles
- **farmer_profiles**: Farm-specific data and verification
- **crops**: Crop listings with photos and details
- **buyer_subscriptions**: Buyer plans and billing
- **verification_documents**: Document uploads for verification
- **conversations**: Message threads between users
- **messages**: Individual chat messages

### Security
- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: Role-based access control
- **Authentication**: Supabase Auth integration

## 📁 File Storage

### Supabase Storage Buckets
- **profile-photos** (public): User profile pictures
- **crop-photos** (public): Crop listing images
- **crop-videos** (public): Crop demonstration videos
- **verification-docs** (private): Identity verification documents

### Storage Utilities (`lib/storage.ts`)
- **Functions**: Upload, delete, get signed URLs
- **Validation**: File size and type checking
- **Platform Support**: Web file picker, future mobile camera

## 🔧 Utilities & Services

### Supabase Client (`lib/supabase.ts`)
- **Configuration**: Client setup with environment variables
- **Helpers**: Authentication check, user management
- **Types**: Full TypeScript integration

### User Role Management (`hooks/useUserRole.ts`)
- **Features**: Role state management, role switching
- **Storage**: localStorage for demo persistence
- **Integration**: Used throughout app for role-based features

### Internationalization (`lib/i18n.ts`)
- **Languages**: English, Hindi, Spanish
- **Usage**: Translation key system
- **Status**: Prepared but not fully implemented

## 🎯 Key Features

### 1. Role-Based Experience
- **Dynamic Navigation**: Tabs change based on user role
- **Adaptive Content**: Different home screen per role
- **Role Switching**: Demo feature for testing

### 2. Comprehensive Profiles
- **Farmers**: Farm details, crops, verification status
- **Buyers**: Company info, requirements, purchasing power
- **Logistics**: Services, coverage areas, experience

### 3. Advanced Search & Discovery
- **Global Search**: Find any entity type
- **Smart Filters**: Verified, top-rated, nearby
- **Rich Results**: Detailed cards with contact options

### 4. Professional Messaging
- **Real-time Chat**: Professional chat interface
- **Participant Types**: Role-based identification
- **Contact Actions**: Call, video, message options

### 5. Crop Management
- **Full CRUD**: Complete crop lifecycle management
- **Visual Management**: Photos, videos, descriptions
- **Status Tracking**: From planting to sale

### 6. Verification System
- **Multi-Method**: Email and SMS verification
- **Document Upload**: ID and farm ownership verification
- **Trust Building**: Verification badges throughout app

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd agriconnect

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: SMS API Keys
EXPO_PUBLIC_SMS77_API_KEY=your_sms77_key
EXPO_PUBLIC_FAST2SMS_API_KEY=your_fast2sms_key
```

### Database Setup
1. Create Supabase project
2. Run migration from `supabase/migrations/`
3. Configure RLS policies
4. Set up storage buckets

## 🧪 Testing

### Demo Features
- **Role Switching**: Test different user experiences
- **Mock Data**: Pre-populated farmers, buyers, logistics
- **OTP Verification**: Console/alert codes for testing
- **File Uploads**: Web file picker simulation

### Test Flows
1. **Authentication**: Email/SMS verification
2. **Onboarding**: Complete role-based setup
3. **Marketplace**: Browse and contact entities
4. **Messaging**: Send and receive messages
5. **Crop Management**: Add, edit, delete crops

## 📱 Platform Compatibility

### Web (Primary)
- ✅ Full feature support
- ✅ File uploads via web picker
- ✅ Responsive design
- ✅ PWA capabilities

### Mobile (Future)
- 📱 Camera integration planned
- 📱 Push notifications
- 📱 Offline capabilities
- 📱 Native file picker

### Platform-Specific Code
```typescript
import { Platform } from 'react-native';

const handleFeature = () => {
  if (Platform.OS === 'web') {
    // Web implementation
  } else {
    // Mobile implementation
  }
};
```

## 🔒 Security Features

### Authentication
- **Multi-factor**: Email and SMS verification
- **Session Management**: Secure token handling
- **Auto-refresh**: Automatic token renewal

### Data Protection
- **RLS Policies**: Database-level security
- **File Encryption**: Secure document storage
- **Input Validation**: Client and server-side validation

### Privacy
- **Data Minimization**: Only collect necessary data
- **User Control**: Profile and data management
- **Secure Communication**: Encrypted messaging

## 🎨 UI/UX Design Principles

### Visual Hierarchy
- **Typography Scale**: Clear heading and body text distinction
- **Color Contrast**: WCAG AA compliance
- **Spacing System**: Consistent 8px grid

### User Experience
- **Progressive Disclosure**: Show relevant information when needed
- **Error Handling**: Inline error messages, no alerts
- **Loading States**: Clear feedback for async operations
- **Accessibility**: Screen reader support, keyboard navigation

### Mobile-First Design
- **Touch Targets**: Minimum 44px touch areas
- **Responsive Layout**: Adapts to all screen sizes
- **Gesture Support**: Swipe, pinch, tap interactions

## 🔄 State Management

### Local State
- **React Hooks**: useState, useEffect for component state
- **Custom Hooks**: useUserRole for role management
- **Context**: Minimal use, prefer prop drilling

### Persistent State
- **localStorage**: Demo data and user preferences
- **Supabase**: Server state and real-time updates
- **AsyncStorage**: Future mobile storage

## 📊 Performance Optimization

### Code Splitting
- **Route-based**: Automatic with Expo Router
- **Component-based**: Lazy loading for heavy components
- **Asset Optimization**: Image compression and caching

### Network Optimization
- **Supabase**: Efficient queries with RLS
- **Caching**: Client-side caching for static data
- **Offline Support**: Future implementation

## 🚀 Deployment

### Web Deployment
```bash
# Build for web
npm run build:web

# Deploy to hosting provider
# (Vercel, Netlify, etc.)
```

### Mobile Deployment
```bash
# Build for app stores
expo build:ios
expo build:android

# Or use EAS Build
eas build --platform all
```

## 📈 Analytics & Monitoring

### User Analytics
- **User Journey**: Track onboarding completion
- **Feature Usage**: Monitor feature adoption
- **Performance**: App performance metrics

### Business Metrics
- **User Growth**: Registration and retention
- **Engagement**: Message volume, crop listings
- **Revenue**: Subscription conversions

## 🔮 Future Enhancements

### Technical
- **Real-time Features**: Live chat, notifications
- **Offline Support**: Sync when connection restored
- **Performance**: Code splitting, lazy loading
- **Testing**: Unit and integration tests

### Features
- **Payment Integration**: RevenueCat for subscriptions
- **Advanced Search**: AI-powered recommendations
- **Logistics Tracking**: Real-time shipment tracking
- **Market Analytics**: Price trends and insights

### Platform Expansion
- **Native Apps**: iOS and Android optimization
- **Desktop**: Electron wrapper for desktop
- **API**: Public API for third-party integrations

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Documentation
- **Setup Guides**: Complete setup instructions
- **API Reference**: Supabase integration details
- **Troubleshooting**: Common issues and solutions

### Community
- **Issues**: GitHub issue tracker
- **Discussions**: Community forum
- **Discord**: Real-time chat support

---

**AgriConnect** - Connecting farmers to global markets, one crop at a time. 🌾