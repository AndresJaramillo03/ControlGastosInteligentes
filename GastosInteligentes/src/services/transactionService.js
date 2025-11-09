import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import NetInfo from "@react-native-community/netinfo";

//Agregar transaccion
export const addTransaction = async (userId, transaction) => {
  try {
    const netInfo = await NetInfo.fetch();

    const newTransaction = {
      ...transaction,
      userId,
      createdAt: serverTimestamp(),
    };

    if (!netInfo.isConnected) {
      const local = JSON.parse(await AsyncStorage.getItem("offline_transactions")) || [];
      local.push({ ...newTransaction, _action: "add" });
      await AsyncStorage.setItem("offline_transactions", JSON.stringify(local));
      console.log("Guardado localmente (sin conexión)");
      return "offline_saved";
    } else {
      const docRef = await addDoc(collection(db, "transactions"), newTransaction);
      console.log("Guardado online");
      return docRef.id;
    }
  } catch (error) {
    console.error("Error al agregar transacción:", error);
    throw error;
  }
};

//actualizar transaccuin
export const updateTransaction = async (id, updatedData) => {
  try {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      // Guardar la actualizacion para sincronizar luego
      const local = JSON.parse(await AsyncStorage.getItem("offline_updates")) || [];
      local.push({ id, updatedData, _action: "update" });
      await AsyncStorage.setItem("offline_updates", JSON.stringify(local));
      console.log("Actualización guardada localmente (sin conexión)");
      return "offline_updated";
    } else {
      const docRef = doc(db, "transactions", id);
      await updateDoc(docRef, { ...updatedData, updatedAt: serverTimestamp() });
      console.log("Transacción actualizada online");
      return "online_updated";
    }
  } catch (error) {
    console.error("Error al actualizar transacción:", error);
    throw error;
  }
};

//Eliminar transaccion
export const deleteTransaction = async (id) => {
  try {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      // Guardar la eliminación para sincronizar luego
      const local = JSON.parse(await AsyncStorage.getItem("offline_deletes")) || [];
      local.push({ id, _action: "delete" });
      await AsyncStorage.setItem("offline_deletes", JSON.stringify(local));
      console.log("Eliminación guardada localmente (sin conexión)");
      return "offline_deleted";
    } else {
      await deleteDoc(doc(db, "transactions", id));
      console.log("Transacción eliminada online");
      return "online_deleted";
    }
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    throw error;
  }
};

//sincronizacion cuando haya internet
export const syncOfflineTransactions = async (userId) => {
  //sincronizar agregados
  const localAdds = JSON.parse(await AsyncStorage.getItem("offline_transactions")) || [];
  if (localAdds.length > 0) {
    console.log(`Sincronizando ${localAdds.length} transacciones agregadas...`);
    for (const t of localAdds) {
      await addDoc(collection(db, "transactions"), {
        ...t,
        userId,
        syncedAt: serverTimestamp(),
      });
    }
    await AsyncStorage.removeItem("offline_transactions");
    console.log("Sincronización de agregados completada");
  }

  //sincronizar actualizaciones
  const localUpdates = JSON.parse(await AsyncStorage.getItem("offline_updates")) || [];
  if (localUpdates.length > 0) {
    console.log(`Sincronizando ${localUpdates.length} actualizaciones...`);
    for (const u of localUpdates) {
      const docRef = doc(db, "transactions", u.id);
      await updateDoc(docRef, { ...u.updatedData, syncedAt: serverTimestamp() });
    }
    await AsyncStorage.removeItem("offline_updates");
    console.log("Sincronización de actualizaciones completada");
  }

  //sincronizar eliminaciones
  const localDeletes = JSON.parse(await AsyncStorage.getItem("offline_deletes")) || [];
  if (localDeletes.length > 0) {
    console.log(`Sincronizando ${localDeletes.length} eliminaciones...`);
    for (const d of localDeletes) {
      await deleteDoc(doc(db, "transactions", d.id));
    }
    await AsyncStorage.removeItem("offline_deletes");
    console.log("Sincronización de eliminaciones completada");
  }
};

//obtener transaciones
export const getTransactionByUser = async (userId) => {
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("transactionDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    throw error;
  }
};
