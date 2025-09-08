import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Pressable, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addTransaction, updateTransaction } from '../../services/transactionService';
import { auth } from '../../config/firebase';

const paymentMethods = ['efectivo', 'tarjeta', 'transferencia'];

const CATEGORIES = {
  expense: [
    'Alimentación','Transporte','Ocio','Salud','Vivienda',
    'Servicios','Educación','Deudas','Impuestos','Otros'
  ],
  income: [
    'Salario','Freelance','Ventas','Intereses',
    'Inversiones','Regalos','Reembolsos','Otros'
  ],
};

const Chip = ({ active, label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: active ? '#0A84FF' : '#ccc',
      backgroundColor: active ? '#E8F2FF' : 'white',
      marginRight: 8,
      marginBottom: 8
    }}>
    <Text style={{ color: active ? '#0A84FF' : '#333' }}>{label}</Text>
  </Pressable>
);

const toYMD = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const TransactionFormScreen = ({ route, navigation }) => {
  const editing = Boolean(route.params?.item);
  const item = route.params?.item;

  const [type, setType] = useState(item?.type ?? 'expense');
  const [amount, setAmount] = useState(String(item?.amount ?? ''));
  const [description, setDescription] = useState(item?.description ?? '');
  const [paymentMethod, setPaymentMethod] = useState(item?.paymentMethod ?? paymentMethods[0]);

  const initialDate = item?.transactionDate?.toDate
    ? item.transactionDate.toDate()
    : (item?.transactionDate ? new Date(item.transactionDate) : new Date());
  const [transactionDate, setTransactionDate] = useState(initialDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date) => {
    setTransactionDate(date);
    hideDatePicker();
  };

  const categoryOptions = CATEGORIES[type];
  const [category, setCategory] = useState(
    item?.category && CATEGORIES[item?.type ?? 'expense'].includes(item.category)
      ? item.category
      : categoryOptions[0]
  );

  useEffect(() => {
    if (!categoryOptions.includes(category)) {
      setCategory(categoryOptions[0]);
    }

  }, [type]);

  const onSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      return Alert.alert('Datos incompletos', 'Ingresa un monto numérico válido.');
    }
    if (!category) {
      return Alert.alert('Datos incompletos', 'Selecciona una categoría.');
    }
    if (!paymentMethod) {
      return Alert.alert('Datos incompletos', 'Selecciona un método de pago.');
    }
    if (!transactionDate || isNaN(transactionDate.getTime())) {
      return Alert.alert('Datos incompletos', 'Selecciona una fecha válida.');
    }

    const uid = auth.currentUser?.uid;
    const payload = {
      type,
      category,
      amount: Number(amount),
      description,
      paymentMethod,
      transactionDate,
    };

    if (editing) {
      await updateTransaction(uid, item.id, payload);
    } else {
      await addTransaction(uid, payload);
    }
    navigation.goBack();
  };

  const descriptionPlaceholder =
    type === 'income' ? 'Ej: salario, freelance' : 'Ej: almuerzo, mercado';

  const categoryLabel = type === 'income' ? 'Categoría de ingreso' : 'Categoría de gasto';

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Tipo */}
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Gasto/Ingreso (tipo)</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <Chip label="Gasto" active={type === 'expense'} onPress={() => setType('expense')} />
        <Chip label="Ingreso" active={type === 'income'} onPress={() => setType('income')} />
      </View>

      {/* Categoría */}
      <Text style={{ fontWeight: 'bold' }}>{categoryLabel}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {categoryOptions.map(c => (
          <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
        ))}
      </View>

      {/* Monto */}
      <Text style={{ fontWeight: 'bold' }}>Monto</Text>
      <TextInput
        placeholder="0"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }}
      />

      {/* Descripción */}
      <Text style={{ fontWeight: 'bold' }}>Descripción</Text>
      <TextInput
        placeholder={descriptionPlaceholder}
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }}
      />

      {/* Método de pago */}
      <Text style={{ fontWeight: 'bold' }}>Método de pago</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {paymentMethods.map(m => (
          <Chip key={m} label={m} active={paymentMethod === m} onPress={() => setPaymentMethod(m)} />
        ))}
      </View>

      {/* Fecha de transacción (CALENDARIO) */}
      <Text style={{ fontWeight: 'bold' }}>Fecha de transacción</Text>
      <Pressable
        onPress={showDatePicker}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 20 }}
      >
        <Text>{toYMD(transactionDate)}</Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={transactionDate}
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
      />

      <Button title={editing ? 'Guardar cambios' : 'Crear transacción'} onPress={onSubmit} />
    </View>
  );
};

export default TransactionFormScreen;