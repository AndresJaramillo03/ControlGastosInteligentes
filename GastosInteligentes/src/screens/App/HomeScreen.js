import React, {useLayoutEffect} from 'react';
import { View, Text, Button } from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';


const HomeScreen = ({ navigation }) => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sesion cerrada")
    } catch (error){
      console.error("Error al cerrar sesión:", error.message)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={handleLogout} title="salir" color="#0a090aff" />
      ),
    });
  }, [navigation]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20,marginBottom: 30 }}>Pantalla de Inicio</Text>
      
      <Button
        title="Ir a Detalles"
        onPress={() => navigation.navigate('Details')}
      />
    </View>

  );
}

export default HomeScreen;