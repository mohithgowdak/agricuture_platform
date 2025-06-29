/*
  # Supabase Storage Setup for AgriConnect
  
  This script creates storage buckets and policies for:
  1. Profile photos (public)
  2. Crop photos (public) 
  3. Verification documents (private)
  4. Farm videos (public)
  
  Handles existing policies gracefully by dropping and recreating them.
*/

-- Create storage buckets (only if they don't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('crop-photos', 'crop-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('crop-videos', 'crop-videos', true, 52428800, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('verification-docs', 'verification-docs', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;

DROP POLICY IF EXISTS "Farmers can upload crop photos" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can update own crop photos" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can delete own crop photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view crop photos" ON storage.objects;

DROP POLICY IF EXISTS "Farmers can upload crop videos" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can update own crop videos" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can delete own crop videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view crop videos" ON storage.objects;

DROP POLICY IF EXISTS "Farmers can upload own verification docs" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can view own verification docs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all verification docs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update verification docs" ON storage.objects;

-- Profile Photos Policies
CREATE POLICY "Users can upload own profile photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own profile photos" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile photos" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view profile photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profile-photos');

-- Crop Photos Policies
CREATE POLICY "Farmers can upload crop photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'crop-photos' AND
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    WHERE user_id = auth.uid() AND 
    id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Farmers can update own crop photos" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'crop-photos' AND
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    WHERE user_id = auth.uid() AND 
    id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Farmers can delete own crop photos" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'crop-photos' AND
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    WHERE user_id = auth.uid() AND 
    id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Anyone can view crop photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'crop-photos');

-- Crop Videos Policies
CREATE POLICY "Farmers can upload crop videos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'crop-videos' AND
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    WHERE user_id = auth.uid() AND 
    id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Farmers can update own crop videos" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'crop-videos' AND
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    WHERE user_id = auth.uid() AND 
    id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Farmers can delete own crop videos" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'crop-videos' AND
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    WHERE user_id = auth.uid() AND 
    id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Anyone can view crop videos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'crop-videos');

-- Verification Documents Policies (Private)
CREATE POLICY "Farmers can upload own verification docs" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'verification-docs' AND
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    WHERE user_id = auth.uid() AND 
    id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Farmers can view own verification docs" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'verification-docs' AND
  EXISTS (
    SELECT 1 FROM farmer_profiles 
    WHERE user_id = auth.uid() AND 
    id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Admins can view all verification docs" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'verification-docs' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update verification docs" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'verification-docs' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);