import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';

const API_BASE = 'http://172.20.10.2:8000'; // <-- your IP

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/transactions/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Could not load this transaction.</Text>
      </SafeAreaView>
    );
  }

  const sar = data.sar_report;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.amount}>${data.amount.toLocaleString()}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {data.predicted_fraud ? 'Flagged as Suspicious' : 'Looks Normal'}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Account Before → After</Text>
          <Text style={styles.rowText}>
            Sender: ${data.oldbalanceOrg.toLocaleString()} → ${data.newbalanceOrig.toLocaleString()}
          </Text>
          <Text style={styles.rowText}>
            Receiver: ${data.oldbalanceDest.toLocaleString()} → ${data.newbalanceDest.toLocaleString()}
          </Text>
        </View>

        {sar && (
          <>
            <Text style={styles.sectionTitle}>What Happened</Text>
            <Text style={styles.bodyText}>{sar.summary}</Text>

            <Text style={styles.sectionTitle}>Why It Was Flagged</Text>
            <Markdown style={markdownStyles}>{sar.typology_analysis}</Markdown>

            <Text style={styles.sectionTitle}>Official Report</Text>
            <Markdown style={markdownStyles}>{sar.sar_draft}</Markdown>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  backButton: { marginTop: 10, marginBottom: 6 },
  backText: { fontSize: 16, color: '#2c3e50', fontWeight: '600' },
  amount: { fontSize: 32, fontWeight: 'bold', marginTop: 10, color: '#000000' },
  statusBadge: {
    backgroundColor: '#fdecea', alignSelf: 'flex-start', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20, marginTop: 8, marginBottom: 16,
  },
  statusText: { color: '#c0392b', fontWeight: '700', fontSize: 13 },
  summaryCard: { backgroundColor: '#f7f7f7', borderRadius: 12, padding: 16, marginBottom: 20 },
  cardLabel: { fontSize: 13, fontWeight: '700', color: '#666666', marginBottom: 8 },
  rowText: { fontSize: 14, color: '#333333', marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 20, marginBottom: 8, color: '#000000' },
  bodyText: { fontSize: 14, lineHeight: 21, color: '#333333' },
});

const markdownStyles = {
  body: { fontSize: 14, lineHeight: 21, color: '#333333' },
  heading3: { fontSize: 15, fontWeight: '700' as const, marginTop: 12, marginBottom: 6, color: '#000000' },
  strong: { fontWeight: '700' as const, color: '#000000' },
};