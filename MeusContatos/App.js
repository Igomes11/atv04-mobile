import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from './src/screens/Splash';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import ListaContatos from './src/screens/ListaContatos';
import FormularioContato from './src/screens/FormularioContato';
import DetalhesContato from './src/screens/DetalhesContato';
import Perfil from './src/screens/Perfil';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} Options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={Cadastro} Options={{ headerShown: false }} />
        <Stack.Screen name="ListaContatos" component={ListaContatos} Options={{ headerShown: false }} />
        <Stack.Screen name="FormularioContato" component={FormularioContato} Options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesContato" component={DetalhesContato} Options={{ headerShown: false }} />
        <Stack.Screen name="Perfil" component={Perfil} Options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}