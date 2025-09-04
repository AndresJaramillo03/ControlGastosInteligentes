// import * as React from 'react';
// import { Button, Text, View, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import HomeScreen from './src/screens/HomeScreen';
// import DetailsScreen from './src/screens/DetailsScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import SettingsScreen from './src/screens/SettingScreen';

// //navegadores
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// function StackNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{headerShown: false}}>
//       <Stack.Screen name="StackHome" component={HomeScreen} />
//       <Stack.Screen name="Details" component={DetailsScreen} />
//     </Stack.Navigator>
//   );
// }

// function TabNavigator() {
//   return (
//     <Tab.Navigator screenOptions={{headerShown: false}}>
//       <Tab.Screen name="TabHome" component={StackNavigator} options={{title: 'Inicio'}} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//     </Tab.Navigator>
//   );
// }

// function DrawerNavigator(){
//   return(
//     <Drawer.Navigator>
//       <Drawer.Screen name='DrawerHome' component={TabNavigator}options={{ title: "Inicio" }}/>
//       <Drawer.Screen name="Profile" component={ProfileScreen}/>
//     </Drawer.Navigator>
//   )
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <DrawerNavigator/>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from './src/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario registrado:', userCredential.user);
      })
      .catch(error => console.log('Error:', error.message));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        onChangeText={setEmail}
        style={{ borderWidth: 1,marginBottom: 10 }} />
      <Text>Contraseña:</Text>
      <TextInput
        secureTextEntry
        onChangeText={ setPassword } style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Registrarse" onPress={handleSignUp} />
    </View>
  );
} 