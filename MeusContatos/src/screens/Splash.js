import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function Splash({ navigation }) {
  
  useEffect(() => {
    // Aguarda 2 segundos para exibir a splash screen fiel ao design
    const timer = setTimeout(() => {
      // Verifica o estado atual do utilizador no Firebase de forma segura
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // Cancela o listener para evitar loops
        if (user) {
          // Se já estiver logado, vai direto para os contatos
          navigation.replace('ListaContatos');
        } else {
          // Se não estiver logado, vai para o login
          navigation.replace('Login');
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#208AEF" />

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="account-multiple" size={56} color="#208AEF" />
        </View>

        <Text style={styles.title}>Meus Contatos</Text>
        <Text style={styles.subtitle}>Seus contatos sempre{"\n"}com você.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.loaderBarContainer}>
          <View style={styles.loaderBarFill} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#208AEF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#E0F2FE',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  loaderBarContainer: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});