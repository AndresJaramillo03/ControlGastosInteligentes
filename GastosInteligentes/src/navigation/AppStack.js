import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from '../screens/App/HomeScreen';
import ProfileScreen from '../screens/App/HomeScreen';
import SettingScreen from '../screens/App/HomeScreen';
import DetailsScreen from "../screens/App/DetailsScreen";
import TransactionFormScreen from '../screens/App/TransactionListScreen';
import TransactinFormScreen from '../screens/App/TransactionFormScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: true}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Transactions" component={TransactionFormScreen} options={{title: "Transacciones"}} />
            <Stack.Screen name="TransactionsFrom" component={TransactinFormScreen} options={{title: "Transaccion"}} />
        </Stack.Navigator>
    )
}

export default AppStack;