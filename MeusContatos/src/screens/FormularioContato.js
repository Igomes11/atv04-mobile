import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function FormularioContato({ route, navigation }) {
  // Se vier um "contato" via parâmetro, estamos editando. Senão, é cadastro.
  const contatoParaEditar = route.params?.contato;

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [anotacao, setAnotacao] = useState('');

  useEffect(() => {
    if (contatoParaEditar) {
      setNome(contatoParaEditar.nome);
      setTelefone(contatoParaEditar.telefone);
      setCidade(contatoParaEditar.cidade);
      setAnotacao(contatoParaEditar.anotacao || '');
    }
  }, [contatoParaEditar]);

  const salvarContato = async () => {
    if (!nome || !telefone || !cidade) {
      Alert.alert('Erro', 'Nome, telefone e cidade são obrigatórios.');
      return;
    }

    const payload = { nome, telefone, cidade, anotacao };

    try {
      if (contatoParaEditar) {
        // Modo Edição: Consome API via PUT
        await api.put(`/contatos/${contatoParaEditar.id}`, payload);
        Alert.alert('Sucesso', 'Contato atualizado com sucesso!');
      } else {
        // Modo Criação: Consome API via POST
        await api.post('/contatos', payload);
        Alert.alert('Sucesso', 'Contato cadastrado com sucesso!');
      }
      navigation.navigate('ListaContatos'); // Volta para a tela inicial
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o contato.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nome *" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Telefone *" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Cidade *" value={cidade} onChangeText={setCidade} />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Anotação (opcional)" value={anotacao} onChangeText={setAnotacao} multiline />
      
      <Button title="Salvar" onPress={salvarContato} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
  textArea: { height: 100, textAlignVertical: 'top' }
});