import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import ConnectionStatusBanner from './src/components/ConnectionStatusBanner';

export default function App() {
  return (
    <AuthProvider>
      <ConnectionStatusBanner/>
      <RootNavigator />
    </AuthProvider>
  );
}
