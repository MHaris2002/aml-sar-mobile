import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';

const API_BASE = 'http://172.20.10.2:8000'; // <-- same IP as your other screens

export default function SubmitScreen() {
  const [amount, setAmount] = useState('87622.50');
  const [oldbalanceOrg, setOldbalanceOrg] = useState('87622.50');
  const [newbalanceOrig, setNewbalanceOrig] = useState('0');
  const [oldbalanceDest, setOldbalanceDest] = useState('0');
  const [newbalanceDest, setNewbalanceDest] = useState('0');
  const [isTransfer, setIsTransfer] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          oldbalanceOrg: parseFloat(oldbalanceOrg),
          newbalanceOrig: parseFloat(newbalanceOrig),
          oldbalanceDest: parseFloat(oldbalanceDest),
          newbalanceDest: parseFloat(newbalanceDest),
          is_transfer: isTransfer,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.header}>Submit Transaction</Text>
        <Text style={styles.subheader}>
          Runs the full pipeline live: detection model → RAG retrieval → LLM SAR draft
        </Text>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#999999"
        />

        <Text style={styles.label}>Origin balance (before)</Text>
        <TextInput
          style={styles.input}
          value={oldbalanceOrg}
          onChangeText={setOldbalanceOrg}
          keyboardType="numeric"
          placeholderTextColor="#999999"
        />

        <Text style={styles.label}>Origin balance (after)</Text>
        <TextInput
          style={styles.input}
          value={newbalanceOrig}
          onChangeText={setNewbalanceOrig}
          keyboardType="numeric"
          placeholderTextColor="#999999"
        />

        <Text style={styles.label}>Destination balance (before)</Text>
        <TextInput
          style={styles.input}
          value={oldbalanceDest}
          onChangeText={setOldbalanceDest}
          keyboardType="numeric"
          placeholderTextColor="#999999"
        />

        <Text style={styles.label}>Destination balance (after)</Text>
        <TextInput
          style={styles.input}
          value={newbalanceDest}
          onChangeText={setNewbalanceDest}
          keyboardType="numeric"
          placeholderTextColor="#999999"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Is Transfer</Text>
          <Switch value={isTransfer} onValueChange={setIsTransfer} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Analyze Transaction</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingHint}>
            Running model prediction, RAG retrieval, and 3 LLM calls — this takes 10-20 seconds...
          </Text>
        )}

        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>
              Fraud Prediction: {result.predicted_fraud ? 'FLAGGED' : 'CLEAR'}
              {'  '}({(result.fraud_probability * 100).toFixed(2)}%)
            </Text>

            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.bodyText}>{result.summary}</Text>

            <Text style={styles.sectionTitle}>Why This Was Flagged</Text>
            <Markdown style={markdownStyles}>{result.typology_analysis}</Markdown>

            <Text style={styles.sectionTitle}>Official Report</Text>
            <Markdown style={markdownStyles}>{result.sar_draft}</Markdown>

            <Text style={styles.sectionTitle}>Sources</Text>
            {result.retrieved_sources?.map((src: string, i: number) => (
              <Text key={i} style={styles.sourceItem}>• {src}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const markdownStyles = {
  body: { fontSize: 14, lineHeight: 21, color: '#333333' },
  heading3: { fontSize: 16, fontWeight: '700' as const, marginTop: 14, marginBottom: 6, color: '#000000' },
  strong: { fontWeight: '700' as const, color: '#000000' },
  bullet_list: { marginTop: 4 },
  list_item: { marginBottom: 4 },
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#ffffff' },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#000000' },
  subheader: { fontSize: 13, color: '#666666', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 4, color: '#000000' },
  input: {
    borderWidth: 1, borderColor: '#cccccc', borderRadius: 8,
    padding: 10, fontSize: 15, color: '#000000', backgroundColor: '#fafafa',
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 16,
  },
  button: {
    backgroundColor: '#2c3e50', padding: 14, borderRadius: 10,
    alignItems: 'center', marginTop: 20,
  },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  loadingHint: { fontSize: 12, color: '#666666', textAlign: 'center', marginTop: 10 },
  errorText: { color: 'red', marginTop: 10 },
  resultBox: { marginTop: 24, padding: 14, backgroundColor: '#f7f7f7', borderRadius: 10 },
  resultLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#c0392b' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 14, marginBottom: 4, color: '#000000' },
  bodyText: { fontSize: 13, lineHeight: 19, color: '#333333' },
  sourceItem: { fontSize: 12, color: '#555555', marginTop: 2 },
});