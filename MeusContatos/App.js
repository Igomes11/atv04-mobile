import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importação da configuração do Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebaseConfig';

// Importação das telas (vamos criá-las em seguida)
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import ListaContatos from './src/screens/ListaContatos';
import FormularioContato from './src/screens/FormularioContato'; // Servirá para Novo e Editar
import DetalhesContato from './src/screens/DetalhesContato';
import Perfil from './src/screens/Perfil';

const Stack = createStackNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // O Firebase "escuta" se há um usuário logado ou não
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return unsubscribe; // Limpa o listener quando o componente for desmontado
  }, []);

  // Tela de carregamento enquanto o Firebase verifica o login
  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {usuario ? (
          // ROTAS AUTENTICADAS (O usuário está logado)
          <>
            <Stack.Screen 
              name="ListaContatos" 
              component={ListaContatos} 
              options={{ title: 'Meus Contatos' }} 
            />
            <Stack.Screen 
              name="FormularioContato" 
              component={FormularioContato} 
              options={{ title: 'Contato' }} 
            />
            <Stack.Screen 
              name="DetalhesContato" 
              component={DetalhesContato} 
              options={{ title: 'Detalhes' }} 
            />
            <Stack.Screen 
              name="Perfil" 
              component={Perfil} 
              options={{ title: 'Meu Perfil' }} 
            />
          </>
        ) : (
          // ROTAS NÃO AUTENTICADAS (O usuário NÃO está logado)
          <>
            <Stack.Screen 
              name="Login" 
              component={Login} 
              options={{ headerShown: false }} // Esconde o cabeçalho no login
            />
            <Stack.Screen 
              name="Cadastro" 
              component={Cadastro} 
              options={{ title: 'Criar Conta' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}