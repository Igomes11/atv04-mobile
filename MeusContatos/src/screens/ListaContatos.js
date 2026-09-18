import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, FlatList, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';

export default function ListaContatos({ navigation }) {
  const [contatos, setContatos] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    // Procura apenas os contactos associados ao ID do utilizador logado
    const q = query(
      collection(db, 'contatos'), 
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setContatos(lista);
    });

    return () => unsubscribe();
  }, []);

  // Filtra os contactos com base na barra de busca
  const contatosFiltrados = contatos.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const renderContato = ({ item }) => {
    const getIniciais = (nomeCompleto) => {
      if (!nomeCompleto) return "";
      const partes = nomeCompleto.trim().split(" ");
      if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    };

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('DetalhesContato', { contato: item })}
      >
        <View style={styles.cardAvatar}>
          <Text style={styles.cardInitials}>{getIniciais(item.nome)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <Text style={styles.cardTelefone}>{item.telefone}</Text>
          <Text style={styles.cardCidade}>{item.cidade}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#208AEF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Contatos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FormularioContato')}>
          <MaterialCommunityIcons name="plus-circle-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={24} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar contato..."
            value={busca}
            onChangeText={setBusca}
            outlineStyle="none"
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      {contatos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="card-account-details-outline" size={80} color="#d3d3d3" />
          <Text style={styles.emptyTitle}>Nenhum contato ainda</Text>
          <Text style={styles.emptySubtitle}>
            Adicione seus primeiros contatos{"\n"}para começar.
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('FormularioContato')}
          >
            <Text style={styles.addButtonText}>Adicionar contato</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contatosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderContato}
          contentContainerStyle={styles.lista}
        />
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="account" size={26} color="#208AEF" />
          <Text style={[styles.tabText, { color: '#208AEF' }]}>Contatos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Perfil')}
        >
          <MaterialCommunityIcons name="account-outline" size={26} color="#999" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: '#208AEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  searchContainer: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  searchBox: { flexDirection: 'row', backgroundColor: '#F5F6FA', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, alignItems: 'center' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333', outlineStyle: 'none' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 8, marginBottom: 25, lineHeight: 20 },
  addButton: { backgroundColor: '#208AEF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  lista: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardAvatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#208AEF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardInitials: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardTelefone: { fontSize: 14, color: '#666', marginTop: 2 },
  cardCidade: { fontSize: 12, color: '#999', marginTop: 1 },
  bottomBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#EAEAEA', paddingVertical: 10, paddingBottom: Platform.OS === 'ios' ? 20 : 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 12, color: '#999', marginTop: 4, fontWeight: '500' }
});