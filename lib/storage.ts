/**
 * Supabase Storage utilities for file uploads
 */

import { supabase } from './supabase';
import { Platform } from 'react-native';

let AsyncStorage: typeof import('@react-native-async-storage/async-storage').default | undefined;
if (Platform.OS !== 'web') {
  // Dynamically require to avoid issues on web
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    } else if (AsyncStorage) {
      return await AsyncStorage.getItem(key);
    }
    return null;
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else if (AsyncStorage) {
      await AsyncStorage.setItem(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else if (AsyncStorage) {
      await AsyncStorage.removeItem(key);
    }
  },
  async clear(): Promise<void> {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.clear();
    } else if (AsyncStorage) {
      await AsyncStorage.clear();
    }
  }
};

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload profile photo
 */
export async function uploadProfilePhoto(
  userId: string,
  file: File | Blob | ArrayBuffer,
  fileName: string
): Promise<UploadResult> {
  try {
    const fileExt = fileName.split('.').pop();
    const filePath = `${userId}/profile.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Replace existing file
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Upload crop photo
 */
export async function uploadCropPhoto(
  farmerId: string,
  cropId: string,
  file: File | Blob | ArrayBuffer,
  fileName: string
): Promise<UploadResult> {
  try {
    const fileExt = fileName.split('.').pop();
    const timestamp = Date.now();
    const filePath = `${farmerId}/${cropId}/${timestamp}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('crop-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('crop-photos')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Upload crop video
 */
export async function uploadCropVideo(
  farmerId: string,
  cropId: string,
  file: File | Blob | ArrayBuffer,
  fileName: string
): Promise<UploadResult> {
  try {
    const fileExt = fileName.split('.').pop();
    const timestamp = Date.now();
    const filePath = `${farmerId}/${cropId}/video_${timestamp}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('crop-videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('crop-videos')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Upload verification document
 */
export async function uploadVerificationDocument(
  farmerId: string,
  documentType: string,
  file: File | Blob | ArrayBuffer,
  fileName: string
): Promise<UploadResult> {
  try {
    const fileExt = fileName.split('.').pop();
    const timestamp = Date.now();
    const filePath = `${farmerId}/${documentType}_${timestamp}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('verification-docs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      path: filePath,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get signed URL for private files (verification documents)
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Platform-specific file picker for web
 */
export function pickImageWeb(): Promise<File | null> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') {
      resolve(null);
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}

/**
 * Platform-specific video picker for web
 */
export function pickVideoWeb(): Promise<File | null> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') {
      resolve(null);
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/webm,video/quicktime';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}

/**
 * Platform-specific document picker for web
 */
export function pickDocumentWeb(): Promise<File | null> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') {
      resolve(null);
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,application/pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}

/**
 * Validate file size and type
 */
export function validateFile(file: File, maxSizeMB: number, allowedTypes: string[]): { valid: boolean; error?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not supported. Allowed: ${allowedTypes.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Convert file to ArrayBuffer for React Native
 */
export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}