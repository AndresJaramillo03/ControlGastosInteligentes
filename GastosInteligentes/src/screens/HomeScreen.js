import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Pantalla de Inicio</Text>
      <Button
        title="Ir a Detalles"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

export default HomeScreen;