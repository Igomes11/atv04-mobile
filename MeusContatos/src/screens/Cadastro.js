import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const realizarCadastro = async () => {
    if (!email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos.');
    
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      // O Firebase loga automaticamente após criar a conta
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a conta. A senha deve ter pelo menos 6 caracteres.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          {/* Mudamos o ícone para representar "adicionar usuário" */}
          <MaterialCommunityIcons name="account-plus" size={40} color="#fff" />
        </View>
        <Text style={styles.titulo}>Criar Nova Conta</Text>
        <Text style={styles.subtitulo}>Preencha os dados para se cadastrar.</Text>
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
            placeholder="Senha (mín. 6 caracteres)"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <MaterialCommunityIcons name={mostrarSenha ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoPrimario} onPress={realizarCadastro}>
          <Text style={styles.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={styles.rodapeRegistro}>
          <Text style={styles.textoNormal}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.textoAzul}>Entrar</Text>
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
  rodapeRegistro: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  textoNormal: { color: '#666', fontSize: 14 },
  textoAzul: { color: '#208AEF', fontSize: 14, fontWeight: 'bold' }
});