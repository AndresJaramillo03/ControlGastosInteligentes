import React from "react";
import {View, Text, StyleSheet } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";

const ConnectionStatusBanner = () => {
    const netInfo = useNetInfo();

    if(netInfo.isConnected === false) {
        return (
            <View style={styles.banner}>
                <Text style={styles.text}>No tienes conexión a Internet</Text>
            </View>
        )
    }

    return null;
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#ff5555',
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
})

export default ConnectionStatusBanner;