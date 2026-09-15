import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const realizarLogin = async () => {
    if (!email || !senha) return Alert.alert('Atenção', 'Preencha e-mail e senha.');
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Ícone representando a Logo */}
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="account" size={40} color="#fff" />
        </View>
        <Text style={styles.titulo}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitulo}>Faça login para acessar seus contatos.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <MaterialCommunityIcons name={mostrarSenha ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoPrimario} onPress={realizarLogin}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSecundario}>
          <Text style={styles.textoLink}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <View style={styles.rodapeRegistro}>
          <Text style={styles.textoNormal}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.textoAzul}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#208AEF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitulo: { fontSize: 14, color: '#666', marginTop: 5 },
  form: { paddingHorizontal: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 5, marginBottom: 25 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', outlineStyle: 'none' },
  botaoPrimario: { backgroundColor: '#208AEF', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoSecundario: { alignItems: 'center', marginTop: 15 },
  textoLink: { color: '#208AEF', fontSize: 14, fontWeight: '500' },
  rodapeRegistro: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  textoNormal: { color: '#666', fontSize: 14 },
  textoAzul: { color: '#208AEF', fontSize: 14, fontWeight: 'bold' }
});