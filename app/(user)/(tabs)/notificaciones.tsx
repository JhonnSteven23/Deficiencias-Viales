import { FlatList, StyleSheet, Text, View } from 'react-native';

const notifications = [
  { id: '1', title: 'Nueva alerta', body: 'Tienes una nueva alerta en tu cuenta.' },
  { id: '2', title: 'Recordatorio', body: 'Recuerda actualizar tu perfil.' },
  { id: '3', title: 'Mantenimiento', body: 'El sistema estará en mantenimiento mañana.' },
];

export default function NotificacionesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationItem: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
});
