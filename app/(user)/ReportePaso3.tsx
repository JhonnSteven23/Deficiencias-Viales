import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ReportData {
  type: string;
  title: string;
  description: string;
  color: string;
  latitude: number;
  longitude: number;
  userDescription: string;
  images: string[];
}

export default function ReportePaso3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const reportType = params.reportType as string;
  const reportTitle = params.reportTitle as string;
  const reportDescription = params.reportDescription as string;
  const reportColor = params.reportColor as string;
  const latitude = parseFloat(params.latitude as string);
  const longitude = parseFloat(params.longitude as string);

  const [userDescription, setUserDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos para acceder a la galería'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos para acceder a la cámara'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGoBack = () => {
    router.back();
  };

  const submitReport = async () => {
    if (!userDescription.trim()) {
      Alert.alert('Error', 'Por favor agrega una descripción del problema');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Por favor agrega al menos una imagen del problema');
      return;
    }

    setIsLoading(true);

    try {
      const reportData: ReportData = {
        type: reportType,
        title: reportTitle,
        description: reportDescription,
        color: reportColor,
        latitude,
        longitude,
        userDescription,
        images,
      };

      console.log('Enviando reporte completo:', reportData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Reporte Enviado',
        'Tu reporte ha sido enviado exitosamente. Te notificaremos cuando sea revisado.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push('/(user)/index');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error enviando reporte:', error);
      Alert.alert('Error', 'No se pudo enviar el reporte. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Reportar una Deficiencia</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.summaryCard, { borderLeftColor: reportColor }]}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Resumen del Reporte</Text>
          </View>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tipo:</Text>
              <Text style={styles.summaryValue}>{reportTitle}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ubicación:</Text>
              <Text style={styles.summaryValue}>
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ejemplo: La deficiencia esta a mitad de la calle"
            value={userDescription}
            onChangeText={setUserDescription}
            multiline
            numberOfLines={6}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {userDescription.length}/500 caracteres
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidencia Fotográfica</Text>        
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.imageButtonText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
              <Ionicons name="image" size={24} color="#007AFF" />
              <Text style={styles.imageButtonText}>Seleccionar de galería</Text>
            </TouchableOpacity>
          </View>
          
          {images.length > 0 && (
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageItem}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImage}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {images.length === 0 && (
            <View style={styles.noImagesContainer}>
              <Ionicons name="image-outline" size={48} color="#ccc" />
              <Text style={styles.noImagesText}>No hay imágenes agregadas</Text>
            </View>
          )}
        </View>

        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isLoading || !userDescription.trim() || images.length === 0) && 
              styles.submitButtonDisabled
            ]}
            onPress={submitReport}
            disabled={isLoading || !userDescription.trim() || images.length === 0}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Enviando Reporte...' : 'Enviar Reporte'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryContent: {
    padding: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    minWidth: 80,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  imageButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageItem: {
    width: '48%',
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeImage: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  noImagesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  noImagesText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    fontWeight: '500',
  },
  noImagesSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  submitSection: {
    padding: 20,
    paddingBottom: 30,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  submitNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 16,
    paddingHorizontal: 10,
  },
});