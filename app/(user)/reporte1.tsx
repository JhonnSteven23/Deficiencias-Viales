import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReporteTypeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'bache',
      title: 'Bache',
      image: require('../../assets/ReporteBache.png'),
      description: 'Hoyos o daños en el pavimento',
    },
    {
      id: 'alcantarilla',
      title: 'Alcantarilla Dañada',
      image: require('../../assets/ReporteAlcantarilla.png'),
      description: 'Tapas rotas, hundidas o faltantes',
    },
    {
      id: 'poste',
      title: 'Poste Dañado',
      image: require('../../assets/ReportePoste.png'),
      description: 'Postes de luz caídos o dañados',
    },

  ];

  const handleContinue = () => {
    if (selectedType) {
      router.push('/(user)/reporte2');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tipo de Reporte</Text>
        <Text style={styles.subtitle}>Selecciona el tipo de deficiencia que encontraste</Text>
      </View>

      <ScrollView style={styles.content}>
        {reportTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              selectedType === type.id && styles.selectedCard,
              { borderLeftColor: type.color }
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Image source={type.image} style={styles.typeImage} />
            <View style={styles.typeContent}>
              <Text style={styles.typeTitle}>{type.title}</Text>
              <Text style={styles.typeDescription}>{type.description}</Text>
            </View>
            <View style={[
              styles.radioButton,
              selectedType === type.id && styles.radioButtonSelected
            ]}>
              {selectedType === type.id && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !selectedType && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedType}
        >
          <Text style={[styles.continueButtonText, !selectedType && styles.continueButtonTextDisabled]}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  content: {
    flex: 1,
    padding: 20,
  },
  typeCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: '#007bff',
    borderWidth: 2,
    borderLeftWidth: 4,
  },
  typeIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  typeDescription: {
    fontSize: 14,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007bff',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  continueButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
  typeImage: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  marginRight: 15,
}
});