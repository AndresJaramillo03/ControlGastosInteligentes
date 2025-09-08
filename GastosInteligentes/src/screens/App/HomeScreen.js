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
    /*<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20,marginBottom: 30 }}>Pantalla de Inicio</Text>
      
      <Button
        title="Ir a Detalles"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Ir a transacciones"
        onPress={() => navigation.navigate('Transactions')}
      />
      <Button
        title="Ir a perfil"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        title="Ir a Ajustes"
        onPress={() => navigation.navigate('Setting')}
      />
    </View>*/

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Pantalla de Inicio</Text>

      <Button title="DETALLES" onPress={() => navigation.navigate('Details')} />
      <Button title="TRANSACCIONES" onPress={() => navigation.navigate('Transactions')} />
      <Button title="AÑADIR TRANSACCION" onPress={() => navigation.navigate('TransactionsFrom')} />
    </View>

  );
}

export default HomeScreen;