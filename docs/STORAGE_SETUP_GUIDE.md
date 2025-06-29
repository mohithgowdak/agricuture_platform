# 📁 Supabase Storage Setup Guide

This guide walks you through setting up Supabase Storage for file uploads in your AgriConnect app.

## 🎯 **Quick Setup**

### **Step 1: Run Storage Setup SQL**

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the content** from `supabase/storage/setup.sql`
3. **Paste and run** the SQL to create buckets and policies

### **Step 2: Verify Storage Buckets**

Go to **Storage** in your Supabase dashboard and verify these buckets exist:

- ✅ **profile-photos** (public) - User profile pictures
- ✅ **crop-photos** (public) - Crop listing images  
- ✅ **crop-videos** (public) - Crop demonstration videos
- ✅ **verification-docs** (private) - Identity verification documents

## 📊 **Storage Structure**

### **File Organization**

```
profile-photos/
├── {user_id}/
│   └── profile.jpg

crop-photos/
├── {farmer_id}/
│   └── {crop_id}/
│       ├── 1640995200000.jpg
│       └── 1640995300000.jpg

crop-videos/
├── {farmer_id}/
│   └── {crop_id}/
│       └── video_1640995200000.mp4

verification-docs/
├── {farmer_id}/
│   ├── government_id_1640995200000.jpg
│   └── farm_ownership_1640995300000.pdf
```

## 🔐 **Security Policies**

### **Profile Photos (Public)**
- ✅ Users can upload/update their own photos
- ✅ Anyone can view profile photos
- ✅ Users can delete their own photos

### **Crop Media (Public)**
- ✅ Farmers can upload photos/videos for their crops
- ✅ Anyone can view crop media
- ✅ Farmers can manage their own crop media

### **Verification Documents (Private)**
- ✅ Farmers can upload their own documents
- ✅ Only farmers can view their own documents
- ✅ Admins can view all documents for verification

## 📱 **File Upload Limits**

| Bucket | Max File Size | Allowed Types |
|--------|---------------|---------------|
| Profile Photos | 5 MB | JPEG, PNG, WebP |
| Crop Photos | 10 MB | JPEG, PNG, WebP |
| Crop Videos | 50 MB | MP4, WebM, QuickTime |
| Verification Docs | 10 MB | JPEG, PNG, WebP, PDF |

## 🛠️ **Usage Examples**

### **Upload Profile Photo**

```typescript
import { uploadProfilePhoto } from '@/lib/storage';

const handleProfileUpload = async (file: File) => {
  const result = await uploadProfilePhoto(userId, file, file.name);
  
  if (result.success) {
    console.log('Photo uploaded:', result.url);
  } else {
    console.error('Upload failed:', result.error);
  }
};
```

### **Upload Crop Photo**

```typescript
import { uploadCropPhoto } from '@/lib/storage';

const handleCropPhotoUpload = async (file: File) => {
  const result = await uploadCropPhoto(farmerId, cropId, file, file.name);
  
  if (result.success) {
    // Add to crop photos array
    setCropPhotos(prev => [...prev, result.url]);
  }
};
```

### **Upload Verification Document**

```typescript
import { uploadVerificationDocument } from '@/lib/storage';

const handleDocumentUpload = async (file: File) => {
  const result = await uploadVerificationDocument(
    farmerId, 
    'government_id', 
    file, 
    file.name
  );
  
  if (result.success) {
    // Save document record to database
    await supabase.from('verification_documents').insert({
      farmer_id: farmerId,
      document_type: 'government_id',
      document_url: result.path,
    });
  }
};
```

## 🎨 **UI Components**

### **ImagePicker Component**

```typescript
import ImagePicker from '@/components/ImagePicker';

<ImagePicker
  onImageSelected={handleImageSelected}
  placeholder="Add Profile Photo"
  maxSizeMB={5}
/>
```

### **DocumentPicker Component**

```typescript
import DocumentPicker from '@/components/DocumentPicker';

<DocumentPicker
  title="Government ID"
  description="Upload your government-issued ID"
  required={true}
  onDocumentSelected={handleDocumentSelected}
/>
```

## 🔧 **Platform Support**

### **Web (Current)**
- ✅ File picker using HTML input
- ✅ Drag & drop support
- ✅ Image preview
- ✅ File validation

### **Mobile (Future)**
- 📱 Camera integration with `expo-camera`
- 📱 Gallery picker with `expo-image-picker`
- 📱 Document scanner integration

## 🚀 **Production Considerations**

### **Performance**
- **Image compression** before upload
- **Progressive loading** for large images
- **Thumbnail generation** for faster loading

### **Storage Optimization**
- **Automatic cleanup** of unused files
- **CDN integration** for faster delivery
- **Image optimization** pipeline

### **Security**
- **Virus scanning** for uploaded files
- **Content moderation** for public images
- **Rate limiting** for uploads

## 🔍 **Troubleshooting**

### **Upload Fails**
1. Check file size limits
2. Verify file type is allowed
3. Ensure user has proper permissions
4. Check network connectivity

### **Images Not Loading**
1. Verify bucket is public (for public images)
2. Check file path is correct
3. Ensure RLS policies allow access
4. Verify Supabase URL is correct

### **Permission Errors**
1. Check RLS policies are created
2. Verify user is authenticated
3. Ensure user has correct role
4. Check bucket permissions

## 📚 **Next Steps**

1. **Test file uploads** in your app
2. **Add image compression** for better performance
3. **Implement progress indicators** for uploads
4. **Add batch upload** for multiple files
5. **Set up CDN** for production

Your Supabase Storage is now ready for production file uploads! 🎉