import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function DetalhesContato({ route, navigation }) {
  const { contato } = route.params;

  const confirmarExclusao = () => {
    Alert.alert(
      'Excluir contato?',
      'Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/contatos/${contato.id}`); // Consome API via DELETE
              Alert.alert('Sucesso', 'Contato removido.');
              navigation.navigate('ListaContatos');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o contato.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.valor}>{contato.nome}</Text>
      
      <Text style={styles.label}>Telefone:</Text>
      <Text style={styles.valor}>{contato.telefone}</Text>
      
      <Text style={styles.label}>Cidade:</Text>
      <Text style={styles.valor}>{contato.cidade}</Text>
      
      <Text style={styles.label}>Anotação:</Text>
      <Text style={styles.valor}>{contato.anotacao || 'Sem anotações'}</Text>

      <View style={styles.botoes}>
        <Button title="Editar" onPress={() => navigation.navigate('FormularioContato', { contato })} />
        <View style={{ marginTop: 10 }}>
          <Button title="Excluir Contato" color="red" onPress={confirmarExclusao} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 14, color: '#666', marginTop: 10 },
  valor: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  botoes: { marginTop: 30 }
});