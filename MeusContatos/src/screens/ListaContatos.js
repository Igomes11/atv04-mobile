import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api'; // Importa a configuração do Axios

export default function ListaContatos({ navigation }) {
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const carregarContatos = async () => {
    setCarregando(true);
    setErro(false);
    try {
      const response = await api.get('/contatos'); // Consome a API REST (GET)
      setContatos(response.data);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  };

  // Recarrega os contatos toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregarContatos();
    }, [])
  );

  if (carregando) {
    return <View style={styles.centro}><ActivityIndicator size="large" /></View>;
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoErro}>Não foi possível carregar os contatos.</Text>
        <Button title="Tentar novamente" onPress={carregarContatos} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {contatos.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.textoVazio}>Nenhum contato ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={contatos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text>{item.cidade}</Text>
              </View>
              <Button 
                title="Detalhes" 
                onPress={() => navigation.navigate('DetalhesContato', { contato: item })} 
              />
            </View>
          )}
        />
      )}
      
      <View style={styles.rodape}>
        <Button 
          title="Adicionar Novo Contato" 
          onPress={() => navigation.navigate('FormularioContato')} 
        />
        <View style={{ marginTop: 10 }}>
          <Button 
            title="Meu Perfil / Sair" 
            color="#888" 
            onPress={() => navigation.navigate('Perfil')} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginHorizontal: 10, marginTop: 10, borderRadius: 8, elevation: 1 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  rodape: { padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  textoErro: { fontSize: 16, color: 'red', marginBottom: 15, textAlign: 'center' },
  textoVazio: { fontSize: 16, color: '#666' }
});