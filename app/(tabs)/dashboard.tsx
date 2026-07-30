import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const API_BASE = 'http://172.20.10.2:8000'; // <-- your IP

type Transaction = {
  id: number;
  amount: number;
  predicted_fraud: number;
  orig_balance_drained: number;
  dest_balance_stayed_zero: number;
};

function getReason(item: Transaction): string {
  if (!item.predicted_fraud) {
    return 'No unusual activity detected';
  }
  if (item.orig_balance_drained && item.dest_balance_stayed_zero) {
    return 'Account was fully emptied and the money never arrived';
  }
  if (item.orig_balance_drained) {
    return 'Account was fully emptied in one transaction';
  }
  return 'Unusual transaction pattern detected';
}

export default function DashboardScreen() {
  const router = useRouter();
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
      <Text style={styles.subheader}>
        {transactions.length} transactions our system flagged as suspicious
      </Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/transaction-detail', params: { id: item.id } })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>
              <Text style={[styles.reason, { color: item.predicted_fraud ? '#c0392b' : '#27ae60' }]}>{getReason(item)}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#ffffff' },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#000000' },
  subheader: { fontSize: 13, color: '#666666', marginBottom: 12 },
  loadingText: { marginTop: 10, color: '#000000' },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#f7f7f7', padding: 16, borderRadius: 12, marginVertical: 5,
  },
  amount: { fontSize: 17, fontWeight: '700', color: '#000000' },
  reason: { fontSize: 12, color: '#c0392b', marginTop: 4 },
  chevron: { fontSize: 22, color: '#999999', marginLeft: 8 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 8 },
  errorHint: { color: '#666666', textAlign: 'center', fontSize: 12 },
});