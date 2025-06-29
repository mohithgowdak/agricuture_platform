# 🚀 Complete Supabase Setup Guide for AgriConnect

This guide walks you through setting up your Supabase project for the AgriConnect agricultural trade platform.

## 📋 **Step 1: Create Supabase Project**

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Click "New Project"**
3. **Choose your organization** (or create one)
4. **Fill in project details:**
   - **Name**: `agriconnect-production` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for project setup

## 🔑 **Step 2: Get Your Project Credentials**

1. **Go to Settings** → **API** in your Supabase dashboard
2. **Copy these values:**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Create/Update your `.env` file:**

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Free SMS API Keys
EXPO_PUBLIC_SMS77_API_KEY=your_sms77_key
EXPO_PUBLIC_FAST2SMS_API_KEY=your_fast2sms_key
```

## 🗄️ **Step 3: Run Database Migrations**

Your database schema is already prepared! Here's how to apply it:

### **Option A: SQL Editor (Recommended)**
1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New Query"**
3. **Copy the entire content** from `supabase/migrations/20250628163734_dusty_desert.sql`
4. **Paste it into the SQL editor**
5. **Click "Run"** to execute the migration
6. **Verify success** - you should see "Success. No rows returned"

### **Option B: Using Supabase CLI (Advanced)**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

## 🔐 **Step 4: Configure Authentication**

### **Enable Email Authentication**
1. **Go to Authentication** → **Settings** in Supabase dashboard
2. **Under "Auth Providers"**, ensure **Email** is enabled
3. **Disable "Confirm email"** for faster testing (you can enable later)
4. **Set "Site URL"** to your app URL (for production)

### **Configure Email Templates (Optional)**
1. **Go to Authentication** → **Email Templates**
2. **Customize the "Magic Link" template** for OTP emails:

```html
<h2>Your AgriConnect Verification Code</h2>
<p>Your verification code is: <strong>{{ .Token }}</strong></p>
<p>This code will expire in 5 minutes.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

### **Security Settings**
1. **Go to Authentication** → **Settings**
2. **Set these security options:**
   - **JWT expiry**: 3600 (1 hour)
   - **Refresh token rotation**: Enabled
   - **Session timeout**: 604800 (1 week)

## 🛡️ **Step 5: Configure Row Level Security (RLS)**

RLS is already configured in your migration, but let's verify:

1. **Go to Authentication** → **Policies**
2. **You should see policies for:**
   - `users` table
   - `farmer_profiles` table  
   - `crops` table
   - `buyer_subscriptions` table
   - `verification_documents` table
   - `conversations` table
   - `messages` table

3. **If policies are missing**, re-run the migration from Step 3

## 📊 **Step 6: Verify Database Structure**

Check that all tables were created:

1. **Go to Table Editor** in Supabase dashboard
2. **You should see these tables:**
   - ✅ `users` - Core user data
   - ✅ `farmer_profiles` - Farmer information
   - ✅ `crops` - Crop listings
   - ✅ `buyer_subscriptions` - Buyer plans
   - ✅ `verification_documents` - Document uploads
   - ✅ `conversations` - Message threads
   - ✅ `messages` - Individual messages

## 🧪 **Step 7: Test Your Setup**

### **Test Database Connection**
1. **Run your app**: `npm run dev`
2. **Check browser console** for any Supabase connection errors
3. **Try the authentication flow** at `/auth/free-phone-verify`

### **Test Email OTP**
1. **Go to your app** and select "Email" verification
2. **Enter your email address**
3. **Check your email** for the OTP
4. **Enter the OTP** to complete verification

### **Test Database Writes**
1. **Complete the onboarding flow** after authentication
2. **Check Supabase Table Editor** to see if data was inserted
3. **Go to Authentication** → **Users** to see registered users

## 🔧 **Step 8: Storage Setup (For Images)**

### **Create Storage Buckets**
1. **Go to Storage** in Supabase dashboard
2. **Create these buckets:**

```sql
-- Profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true);

-- Crop photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crop-photos', 'crop-photos', true);

-- Verification documents (private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-docs', 'verification-docs', false);
```

### **Set Storage Policies**
```sql
-- Allow authenticated users to upload profile photos
CREATE POLICY "Users can upload own profile photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to profile photos
CREATE POLICY "Public can view profile photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profile-photos');

-- Similar policies for crop photos and verification docs...
```

## 🌐 **Step 9: Configure CORS (For Web)**

If you're deploying to web, configure CORS:

1. **Go to Settings** → **API**
2. **Add your domain** to CORS origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)

## 📱 **Step 10: Test Complete Flow**

### **End-to-End Test**
1. **Start your app**: `npm run dev`
2. **Go through authentication** with email OTP
3. **Complete farmer onboarding**:
   - Create farm profile
   - Upload verification documents
   - Add crop listings
4. **Check Supabase dashboard** to verify all data is saved

### **Test Different User Roles**
1. **Create a farmer account** and complete verification
2. **Create a buyer account** and test marketplace
3. **Test messaging** between farmer and buyer

## 🚀 **Step 11: Production Deployment**

### **Environment Variables**
Set these in your production environment:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

### **Security Checklist**
- ✅ RLS policies enabled on all tables
- ✅ Email confirmation enabled (for production)
- ✅ Strong JWT secret
- ✅ CORS configured for your domain
- ✅ Storage policies configured
- ✅ Rate limiting enabled

## 🔍 **Troubleshooting**

### **Common Issues**

**1. "Invalid API key" Error**
- Check your `.env` file has correct Supabase URL and key
- Restart your development server after changing `.env`

**2. "Row Level Security" Errors**
- Verify RLS policies are created (re-run migration)
- Check user is authenticated before database operations

**3. "Email not sent" Error**
- Check Supabase email settings
- Verify email templates are configured
- Check spam folder

**4. "Database connection failed"**
- Verify Supabase project is active
- Check network connectivity
- Verify credentials are correct

### **Debug Tools**

**1. Supabase Logs**
- Go to **Logs** in Supabase dashboard
- Check for authentication and database errors

**2. Browser Console**
- Check for JavaScript errors
- Look for Supabase client errors

**3. Network Tab**
- Verify API requests are being made
- Check response status codes

## 📚 **Next Steps**

After completing this setup:

1. **Test all authentication flows**
2. **Add sample data** for testing
3. **Configure email templates** for production
4. **Set up monitoring** and alerts
5. **Plan for scaling** (connection pooling, etc.)

## 🎯 **Production Checklist**

Before going live:

- [ ] Database migration completed
- [ ] RLS policies tested
- [ ] Authentication working
- [ ] Email OTP functional
- [ ] Storage buckets configured
- [ ] CORS configured for your domain
- [ ] Environment variables set
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Monitoring configured

Your Supabase backend is now ready for AgriConnect! 🎉

## 🔗 **Useful Links**

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Authentication Guide](https://supabase.com/docs/guides/auth)