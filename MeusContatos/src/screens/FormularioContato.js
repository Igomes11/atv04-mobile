import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';

export default function FormularioContato({ route, navigation }) {
  const contatoParaEditar = route.params?.contato || null;
  const isEdicao = !!contatoParaEditar;

  const [nome, setNome] = useState(contatoParaEditar ? contatoParaEditar.nome : '');
  const [telefone, setTelefone] = useState(contatoParaEditar ? contatoParaEditar.telefone : '');
  const [cidade, setCidade] = useState(contatoParaEditar ? contatoParaEditar.cidade : '');
  const [anotacao, setAnotacao] = useState(contatoParaEditar ? contatoParaEditar.anotacao : '');

  // Estado para controlar a visibilidade do Modal idêntico ao Ecrã 8
  const [modalExclusaoVisivel, setModalExclusaoVisivel] = useState(false);

  const aplicarMascaraTelefone = (texto) => {
    let valor = texto.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }
    if (valor.length > 9) {
      valor = `${valor.slice(0, 9)}-${valor.slice(9)}`;
    }
    return valor;
  };

  const salvarContato = async () => {
    if (!nome || !telefone || !cidade) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    try {
      if (isEdicao) {
        const contatoRef = doc(db, 'contatos', contatoParaEditar.id);
        await updateDoc(contatoRef, { nome, telefone, cidade, anotacao });
      } else {
        await addDoc(collection(db, 'contatos'), {
          nome,
          telefone,
          cidade,
          anotacao,
          userId: auth.currentUser.uid,
          createdAt: new Date()
        });
      }
      navigation.goBack();
    } catch (error) {
      alert('Erro ao guardar o contacto.');
    }
  };

  const confirmarExclusao = async () => {
    try {
      if (isEdicao) {
        await deleteDoc(doc(db, 'contatos', contatoParaEditar.id));
        setModalExclusaoVisivel(false);
        navigation.goBack();
      }
    } catch (error) {
      alert('Erro ao excluir o contacto.');
      setModalExclusaoVisivel(false);
    }
  };

  const getIniciais = (nomeCompleto) => {
    if (!nomeCompleto) return "";
    const partes = nomeCompleto.trim().split(" ");
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#208AEF" />

      {/* Cabeçalho Azul */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={34} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdicao ? 'Editar Contato' : 'Novo Contato'}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          {isEdicao && nome ? (
            <View style={[styles.avatarContainer, { backgroundColor: '#208AEF' }]}>
              <Text style={styles.avatarInitials}>{getIniciais(nome)}</Text>
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account" size={65} color="#D1D5DB" />
              <View style={styles.cameraBadge}>
                <MaterialCommunityIcons name="camera" size={16} color="#fff" />
              </View>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nome *"
              placeholderTextColor="#9CA3AF"
              value={nome}
              onChangeText={setNome}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="phone-outline" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Telefone *"
              placeholderTextColor="#9CA3AF"
              value={telefone}
              onChangeText={(texto) => setTelefone(aplicarMascaraTelefone(texto))}
              keyboardType="phone-pad"
              maxLength={15}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Cidade *"
              placeholderTextColor="#9CA3AF"
              value={cidade}
              onChangeText={setCidade}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="text-box-outline" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Anotação (opcional)"
              placeholderTextColor="#9CA3AF"
              value={anotacao}
              onChangeText={setAnotacao}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={salvarContato}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>

            {isEdicao && (
              <TouchableOpacity style={styles.deleteButton} onPress={() => setModalExclusaoVisivel(true)}>
                <Text style={styles.deleteButtonText}>Excluir contato</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (EXATAMENTE COMO O ECRÃ 8 DO PROTÓTIPO) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalExclusaoVisivel}
        onRequestClose={() => setModalExclusaoVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Ícone de Lixeira Circular Vermelho */}
            <View style={styles.trashIconContainer}>
              <MaterialCommunityIcons name="trash-can-outline" size={32} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>Excluir contato?</Text>
            <Text style={styles.modalSubtitle}>
              Tem certeza que deseja excluir {"\n"}este contato? Esta ação não pode {"\n"}ser desfeita.
            </Text>

            {/* Botões de Ação do Modal */}
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
  container: { flex: 1, backgroundColor: '#fff' },
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
  content: { flex: 1 },
  avatarSection: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarInitials: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#208AEF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  form: { paddingHorizontal: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
    marginBottom: 25,
  },
  icon: { marginRight: 15 },
  input: { flex: 1, fontSize: 16, color: '#333', outlineStyle: 'none' },
  actionContainer: { marginTop: 10, paddingBottom: 40 },
  saveButton: {
    backgroundColor: '#208AEF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },

  // Estilos do Modal Exatamente Fiéis ao Ecrã 8
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro translúcido igualzinho ao protótipo
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
    backgroundColor: '#FEE2E2', // Vermelho bem claro de fundo
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
  modalCancelText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#EF4444', // Vermelho forte do botão de exclusão
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalDeleteText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  }
});