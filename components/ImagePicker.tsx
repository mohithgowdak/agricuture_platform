import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Platform } from 'react-native';
import { Camera, Upload, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { pickImageWeb, validateFile } from '@/lib/storage';

interface ImagePickerProps {
  onImageSelected: (file: File) => void;
  currentImageUrl?: string;
  placeholder?: string;
  maxSizeMB?: number;
}

export default function ImagePicker({ 
  onImageSelected, 
  currentImageUrl, 
  placeholder = "Add Photo",
  maxSizeMB = 5 
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImageUrl || null);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Info', 'Image picker is only available on web in this demo');
      return;
    }

    setLoading(true);
    try {
      const file = await pickImageWeb();
      
      if (file) {
        // Validate file
        const validation = validateFile(file, maxSizeMB, ['image/jpeg', 'image/png', 'image/webp']);
        
        if (!validation.valid) {
          Alert.alert('Error', validation.error);
          return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setSelectedImage(previewUrl);
        
        // Call parent callback
        onImageSelected(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    // You might want to call a callback here to notify parent
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <X color={Colors.text.inverse} size={16} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.picker}
          onPress={handleImagePick}
          disabled={loading}
        >
          <Upload color={Colors.neutral[500]} size={24} />
          <Text style={styles.pickerText}>
            {loading ? 'Selecting...' : placeholder}
          </Text>
        </TouchableOpacity>
      )}
      
      {selectedImage && (
        <TouchableOpacity 
          style={styles.changeButton}
          onPress={handleImagePick}
          disabled={loading}
        >
          <Text style={styles.changeButtonText}>Change Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  picker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[50],
    gap: 8,
  },
  pickerText: {
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[300],
  },
  changeButtonText: {
    fontSize: 12,
    color: Colors.primary[700],
    fontWeight: '500',
  },
});