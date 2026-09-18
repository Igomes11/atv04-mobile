import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export default function DetalhesContato({ route, navigation }) {
  const { contato } = route.params;

  // Estado para controlar o Modal de exclusão idêntico ao protótipo
  const [modalExclusaoVisivel, setModalExclusaoVisivel] = useState(false);

  const getIniciais = (nomeCompleto) => {
    if (!nomeCompleto) return "";
    const partes = nomeCompleto.trim().split(" ");
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const confirmarExclusao = async () => {
    try {
      await deleteDoc(doc(db, 'contatos', contato.id));
      setModalExclusaoVisivel(false);
      navigation.goBack(); // Retorna para a lista após apagar
    } catch (error) {
      alert('Erro ao excluir o contacto.');
      setModalExclusaoVisivel(false);
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
        <Text style={styles.headerTitle}>Detalhes do Contato</Text>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('FormularioContato', { contato })}
          style={styles.editHeaderButton}
        >
          <MaterialCommunityIcons name="pencil" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Secção do Avatar */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarInitials}>{getIniciais(contato.nome)}</Text>
          </View>
          <Text style={styles.nomeText}>{contato.nome}</Text>
        </View>

        {/* Informações detalhadas */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone-outline" size={24} color="#208AEF" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{contato.telefone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color="#208AEF" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Cidade</Text>
              <Text style={styles.infoValue}>{contato.cidade}</Text>
            </View>
          </View>

          {contato.anotacao ? (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="text-box-outline" size={24} color="#208AEF" style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Anotação</Text>
                  <Text style={styles.infoValue}>{contato.anotacao}</Text>
                </View>
              </View>
            </>
          ) : null}
        </View>

        {/* Botões de Ação (Editar e Excluir) */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('FormularioContato', { contato })}
          >
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.editButtonText}>Editar Contato</Text>
          </TouchableOpacity>

          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => setModalExclusaoVisivel(true)}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.deleteButtonText}>Excluir contato</Text>
            
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalExclusaoVisivel}
        onRequestClose={() => setModalExclusaoVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.trashIconContainer}>
              <MaterialCommunityIcons name="trash-can-outline" size={32} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>Excluir contato?</Text>
            <Text style={styles.modalSubtitle}>
              Tem certeza que deseja excluir {"\n"}este contato? Esta ação não pode {"\n"}ser desfeita.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setModalExclusaoVisivel(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalDeleteButton} 
                onPress={confirmarExclusao}
              >
                <Text style={styles.modalDeleteText}>Excluir</Text>
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
    backgroundColor: '#F5F6FA',
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
  backButton: {
    padding: 5,
    width: 45,
  },
  editHeaderButton: {
    padding: 5,
    width: 45,
    alignItems: 'flex-end',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  nomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  actionContainer: {
    marginBottom: 40,
  },
  editButton: {
    backgroundColor: '#208AEF',
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Estilos do Modal de Exclusão
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
  trashIconContainer: {
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