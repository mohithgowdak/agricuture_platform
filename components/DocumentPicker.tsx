import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { FileText, Upload, CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { pickDocumentWeb, validateFile } from '@/lib/storage';

interface DocumentPickerProps {
  onDocumentSelected: (file: File) => void;
  title: string;
  description: string;
  required?: boolean;
  maxSizeMB?: number;
}

export default function DocumentPicker({ 
  onDocumentSelected, 
  title, 
  description, 
  required = false,
  maxSizeMB = 10 
}: DocumentPickerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDocumentPick = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Info', 'Document picker is only available on web in this demo');
      return;
    }

    setLoading(true);
    try {
      const file = await pickDocumentWeb();
      
      if (file) {
        // Validate file
        const validation = validateFile(
          file, 
          maxSizeMB, 
          ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
        );
        
        if (!validation.valid) {
          Alert.alert('Error', validation.error);
          return;
        }

        setSelectedFile(file);
        onDocumentSelected(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select document');
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = () => {
    setSelectedFile(null);
    // You might want to call a callback here to notify parent
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FileText color={Colors.primary[600]} size={24} />
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {title} {required && <Text style={styles.required}>*</Text>}
          </Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {selectedFile && (
          <CheckCircle color={Colors.success[500]} size={20} />
        )}
      </View>

      {selectedFile ? (
        <View style={styles.selectedFile}>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
            <Text style={styles.fileSize}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={removeDocument}>
            <X color={Colors.error[500]} size={16} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handleDocumentPick}
          disabled={loading}
        >
          <Upload color={Colors.primary[600]} size={16} />
          <Text style={styles.uploadButtonText}>
            {loading ? 'Selecting...' : 'Upload Document'}
          </Text>
        </TouchableOpacity>
      )}

      {selectedFile && (
        <TouchableOpacity 
          style={styles.changeButton}
          onPress={handleDocumentPick}
          disabled={loading}
        >
          <Text style={styles.changeButtonText}>Change Document</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  required: {
    color: Colors.error[500],
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success[50],
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success[200],
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.success[700],
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: Colors.success[600],
  },
  removeButton: {
    padding: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.primary[600],
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  changeButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  changeButtonText: {
    fontSize: 12,
    color: Colors.primary[600],
    fontWeight: '500',
  },
});