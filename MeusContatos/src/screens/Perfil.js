import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function Perfil() {
  const usuario = auth.currentUser;

  const realizarLogout = async () => {
    try {
      await signOut(auth); // Firebase desloga o usuário
    } catch (error) {
      console.log('Erro ao sair da conta:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>
      <Text style={styles.email}>Logado como: {usuario?.email}</Text>
      
      <View style={{ marginTop: 30 }}>
        <Button title="Sair da conta" color="red" onPress={realizarLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  email: { fontSize: 16, color: '#333' }
});