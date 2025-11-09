import React, { useEffect, useState } from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import ConnectionStatusBanner from "./src/components/ConnectionStatusBanner";
import NetInfo from "@react-native-community/netinfo";
import { syncOfflineTransactions } from "./src/services/transactionService";
import { getDB } from "./src/services/database";
import { syncOfflineUsers } from "./src/services/syncService";

function SyncHandler() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnected) {
      console.log("📶 Conexión REAL detectada");
      syncOfflineUsers();
      if (user?.uid) syncOfflineTransactions(user.uid);
    } else {
      console.log("📴 Sin conexión (REAL)");
    }
  }, [isConnected, user]);

  return null;
}

export default function App() {
  useEffect(() => {
    (async () => {
      await getDB();
    })();
  }, []);

  return (
    <AuthProvider>
      <ConnectionStatusBanner />
      <SyncHandler />
      <RootNavigator />
    </AuthProvider>
  );
}
