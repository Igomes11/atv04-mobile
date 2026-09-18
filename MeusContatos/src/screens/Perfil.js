import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function Perfil({ navigation }) {
  const usuarioEmail = auth.currentUser?.email || 'usuario@email.com';
  
  // Estado para controlar a visibilidade do Modal de Saída
  const [modalLogoutVisivel, setModalLogoutVisivel] = useState(false);

  const fazerLogout = async () => {
    try {
      await signOut(auth);
      setModalLogoutVisivel(false);
      // O App.js deteta o estado e redireciona automaticamente para o Login
    } catch (error) {
      alert('Erro ao terminar sessão.');
      setModalLogoutVisivel(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#208AEF" />

      {/* Cabeçalho Azul */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={34} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.spacer} />
      </View>

      {/* Secção do Utilizador */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account" size={55} color="#fff" />
        </View>
        <Text style={styles.emailText}>{usuarioEmail}</Text>
      </View>

      {/* Lista de Opções */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => alert('Funcionalidade em desenvolvimento')}>
          <View style={styles.menuLeft}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Meus dados</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => alert('Funcionalidade em desenvolvimento')}>
          <View style={styles.menuLeft}>
            <MaterialCommunityIcons name="help-circle-outline" size={24} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Ajuda</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>

        {/* Aciona a abertura do Modal de Logout */}
        <TouchableOpacity style={styles.menuItem} onPress={() => setModalLogoutVisivel(true)}>
          <View style={styles.menuLeft}>
            <MaterialCommunityIcons name="logout" size={24} color="#EF4444" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Sair da conta</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Barra de Navegação Inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('ListaContatos')}
        >
          <MaterialCommunityIcons name="account-outline" size={26} color="#999" />
          <Text style={styles.tabText}>Contatos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="account" size={26} color="#208AEF" />
          <Text style={[styles.tabText, { color: '#208AEF' }]}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalLogoutVisivel}
        onRequestClose={() => setModalLogoutVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.logoutIconContainer}>
              <MaterialCommunityIcons name="logout" size={30} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>Sair da conta?</Text>
            <Text style={styles.modalSubtitle}>
              Tem certeza que deseja encerrar {"\n"}a sessão atual?
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setModalLogoutVisivel(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalDeleteButton} 
                onPress={fazerLogout}
              >
                <Text style={styles.modalDeleteText}>Sair</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F6FA' 
  },
  header: {
    backgroundColor: '#208AEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
  },
  backButton: { padding: 5, width: 45 },
  spacer: { width: 45 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emailText: { fontSize: 16, color: '#333', fontWeight: '500' },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 15 },
  menuText: { fontSize: 16, color: '#333' },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 12, color: '#999', marginTop: 4, fontWeight: '500' },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelText: { color: '#374151', fontSize: 15, fontWeight: 'bold' },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalDeleteText: { color: '#fff', fontSize: 15, fontWeight: 'bold' }
});