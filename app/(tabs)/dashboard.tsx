import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE = 'http://172.20.10.2:8000'; // <-- replace with your laptop's IP

type Transaction = {
  id: number;
  amount: number;
  predicted_fraud: number;
};

export default function DashboardScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/transactions?limit=50`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Failed to load: {error}</Text>
        <Text style={styles.errorHint}>Check that your backend is running and reachable at {API_BASE}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Flagged Transactions</Text>
      <Text style={styles.subheader}>{transactions.length} results</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>
            <Text style={styles.badge}>
              {item.predicted_fraud ? 'FLAGGED' : 'CLEAR'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#ffffff' },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 20, backgroundColor: '#ffffff',
  },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#000000' },
  subheader: { fontSize: 14, color: '#666666', marginBottom: 10 },
  loadingText: { marginTop: 10, color: '#000000' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    marginVertical: 5,
  },
  amount: { fontSize: 16, fontWeight: '600', color: '#000000' },
  badge: { fontSize: 12, fontWeight: 'bold', color: '#c0392b' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 8 },
  errorHint: { color: '#666666', textAlign: 'center', fontSize: 12 },
});