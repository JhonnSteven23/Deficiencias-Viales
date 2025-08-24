import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [request, response, prompAsync] = Google.useAuthRequest({
    androidClientId:'',
  })
  
  const handleUserLogin = () => {
    router.replace('/(user)');
  };

  const handleAuthorityLogin = () => {
    router.replace('/(authority)');
  };

  const handleAdminLogin = () => {
    router.replace('/(admin)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Deficiencias Viales</Text>

        <TouchableOpacity style={styles.button} onPress={() => prompAsync().catch((e) => {console.log("Error al iniciar sesion: ", e)})}>
          <Ionicons name="person" size={24} color="#fff" />
          <Text style={styles.buttonText}>Logueo con google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleUserLogin}>
          <Ionicons name="person" size={24} color="#fff" />
          <Text style={styles.buttonText}>Ingresar como Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAuthorityLogin}>
          <Ionicons name="shield" size={24} color="#fff" />
          <Text style={styles.buttonText}>Ingresar como Autoridad</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
          <Ionicons name="settings" size={24} color="#fff" />
          <Text style={styles.buttonText}>Ingresar como Admin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});