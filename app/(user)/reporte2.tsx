import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface ReportData {
  title: string;
  description: string;
  location: LocationCoords | null;
  images: string[];
  type: 'bache' | 'semaforo' | 'señalizacion' | 'otro';
}

const reporte2: React.FC = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationCoords | null>(null);
  const [reportData, setReportData] = useState<ReportData>({
    title: '',
    description: '',
    location: null,
    images: [],
    type: 'bache'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos de ubicación para usar esta función'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const locationData: LocationCoords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setLocation(locationData);
      setSelectedLocation(locationData);
      setReportData(prev => ({ ...prev, location: locationData }));
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
    }
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    const newLocation: LocationCoords = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    
    setSelectedLocation(newLocation);
    setReportData(prev => ({ ...prev, location: newLocation }));
  };

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
        setReportData(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri]
        }));
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
        setReportData(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri]
        }));
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const removeImage = (index: number) => {
    setReportData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const submitReport = async () => {
    if (!reportData.title.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }

    if (!reportData.description.trim()) {
      Alert.alert('Error', 'La descripción es requerida');
      return;
    }

    if (!reportData.location) {
      Alert.alert('Error', 'Debe seleccionar una ubicación en el mapa');
      return;
    }

    setIsLoading(true);

    try {
      // Aquí implementarías la lógica para enviar el reporte al backend
      console.log('Enviando reporte:', reportData);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Éxito',
        'Reporte enviado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              // Resetear formulario
              setReportData({
                title: '',
                description: '',
                location: location,
                images: [],
                type: 'bache'
              });
              setSelectedLocation(location);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error enviando reporte:', error);
      Alert.alert('Error', 'No se pudo enviar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const reportTypes = [
    { key: 'bache', label: 'Bache' },
    { key: 'semaforo', label: 'Semáforo' },
    { key: 'señalizacion', label: 'Señalización' },
    { key: 'otro', label: 'Otro' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Reporte</Text>
        <Text style={styles.subtitle}>Selecciona la ubicación y completa la información</Text>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={selectedLocation || location}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Ubicación del reporte"
                description="Toca el mapa para cambiar la ubicación"
              />
            )}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location-outline" size={50} color="#666" />
            <Text style={styles.placeholderText}>Cargando mapa...</Text>
          </View>
        )}
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Tipo de reporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de deficiencia</Text>
          <View style={styles.typeSelector}>
            {reportTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeOption,
                  reportData.type === type.key && styles.typeOptionSelected
                ]}
                onPress={() => setReportData(prev => ({ ...prev, type: type.key as any }))}
              >
                <Text style={[
                  styles.typeOptionText,
                  reportData.type === type.key && styles.typeOptionTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe brevemente el problema"
            value={reportData.title}
            onChangeText={(text) => setReportData(prev => ({ ...prev, title: text }))}
            maxLength={100}
          />
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Proporciona más detalles sobre la deficiencia vial"
            value={reportData.description}
            onChangeText={(text) => setReportData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        {/* Imágenes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imágenes</Text>
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.imageButtonText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
              <Ionicons name="image" size={24} color="#007AFF" />
              <Text style={styles.imageButtonText}>Seleccionar</Text>
            </TouchableOpacity>
          </View>
          
          {reportData.images.length > 0 && (
            <View style={styles.imageGrid}>
              {reportData.images.map((uri, index) => (
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
        </View>

        {/* Información de ubicación */}
        {selectedLocation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación seleccionada</Text>
            <Text style={styles.locationText}>
              Lat: {selectedLocation.latitude.toFixed(6)}, 
              Lng: {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        {/* Botón de envío */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={submitReport}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Enviando...' : 'Enviar Reporte'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  mapContainer: {
    height: 300,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeOptionText: {
    color: '#333',
    fontSize: 14,
  },
  typeOptionTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  imageButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageItem: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default reporte2;