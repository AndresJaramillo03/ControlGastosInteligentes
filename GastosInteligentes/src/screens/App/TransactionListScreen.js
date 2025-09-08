import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { listenTransactions, deleteTransaction } from '../../services/transactionService';

const money = (n) => {
  if (typeof n !== 'number') return n;
  try { return '$ ' + n.toLocaleString('es-CO', { minimumFractionDigits: 0 }); }
  catch { return `$ ${n}`; }
};

const fmtDate = (val) => {
  const d = val?.toDate ? val.toDate() : (val ? new Date(val) : null);
  return d ? d.toLocaleDateString('es-CO') : '-';
};

const TransactionListScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsub = listenTransactions(uid, setItems);
    return unsub;
  }, []);

  const handleDelete = async (id) => {
    const uid = auth.currentUser?.uid;
    await deleteTransaction(uid, id);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const renderItem = ({ item }) => {
    const badge = item.type === 'income' ? 'Ingreso' : 'Gasto';
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TransactionForm', { item })}
        style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          {badge} — {item.category} • {money(item.amount)}
        </Text>
        <Text>Descripción: {item.description || '-'}</Text>
        <Text>Método de pago: {item.paymentMethod || '-'}</Text>
        <Text>Fecha de transacción: {fmtDate(item.transactionDate)}</Text>
        <Text>Fecha de ingreso (servidor): {fmtDate(item.ingresoDate)}</Text>
        <Text style={{ color: '#777' }}>UID: {item.uid}</Text>

        <View style={{ marginTop: 6, flexDirection: 'row', gap: 8 }}>
          <Button title="Eliminar" onPress={() => handleDelete(item.id)} />
          <View style={{ width: 8 }} />
          <Button title="Editar" onPress={() => navigation.navigate('TransactionForm', { item })} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, gap: 8 }}>
        <Button title="Nueva transacción" onPress={() => navigation.navigate('TransactionForm')} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ListEmptyComponent={<Text style={{ padding: 12 }}>No hay transacciones aún.</Text>}
      />
    </View>
  );
};

export default TransactionListScreen;