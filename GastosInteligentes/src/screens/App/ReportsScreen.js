import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
const endOfMonth   = (d) => new Date(d.getFullYear(), d.getMonth()+1, 0, 23, 59, 59, 999);

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity=1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity=1) => `rgba(0, 0, 0, ${opacity})`,
};

export default function ReportsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const month = useMemo(() => new Date(), []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const qRef = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          where("transactionDate", ">=", startOfMonth(month)),
          where("transactionDate", "<=", endOfMonth(month)),
          orderBy("transactionDate", "asc"),
        );
        const snap = await getDocs(qRef);
        setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid, month]);

  const totals = useMemo(() => {
    const income = rows.filter(r => r.type === "income").reduce((a,b)=>a + Number(b.amount||0), 0);
    const expense = rows.filter(r => r.type === "expense").reduce((a,b)=>a + Number(b.amount||0), 0);
    return { income, expense, balance: income - expense };
  }, [rows]);

  const dailyNet = useMemo(() => {
    const map = new Map();
    rows.forEach(r => {
      const raw = r.transactionDate;
      const d = raw && typeof raw.toDate === "function" ? raw.toDate() : new Date(raw);
      const day = d.getDate();
      const sign = r.type === "income" ? 1 : -1;
      const prev = map.get(day) || 0;
      map.set(day, prev + sign * Number(r.amount || 0));
    });
    const labels = Array.from(map.keys()).sort((a,b)=>a-b).map(String);
    const data = labels.map(l => map.get(Number(l)) || 0);
    return { labels, data };
  }, [rows]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Cargando reportes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Reportes del mes</Text>

      <View style={styles.cards}>
        <View style={styles.card}><Text style={styles.cardTitle}>Ingresos</Text><Text style={styles.amount}>${totals.income.toFixed(2)}</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>Gastos</Text><Text style={styles.amount}>${totals.expense.toFixed(2)}</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>Balance</Text><Text style={[styles.amount, totals.balance>=0?styles.ok:styles.bad]}>{(totals.balance>=0?"+":"")}${totals.balance.toFixed(2)}</Text></View>
      </View>

      <Text style={styles.section}>Flujo neto por día</Text>
      {dailyNet.labels.length === 0 ? <Text style={styles.muted}>No hay datos este mes.</Text> : (
        <BarChart
          data={{ labels: dailyNet.labels, datasets: [{ data: dailyNet.data }] }}
          width={screenWidth - 16}
          height={260}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          style={{ borderRadius: 8 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  section: { marginTop: 16, marginBottom: 8, fontSize: 16, fontWeight: "600" },
  muted: { color: "#666" },
  cards: { flexDirection: "row", gap: 8 },
  card: { flex: 1, backgroundColor: "#f2f2f2", padding: 12, borderRadius: 12 },
  cardTitle: { color: "#555", marginBottom: 4 },
  amount: { fontSize: 18, fontWeight: "700" },
  ok: { color: "green" },
  bad: { color: "crimson" },
});