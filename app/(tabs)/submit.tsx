import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';

const API_BASE = 'http://172.20.10.2:8000'; // <-- your IP

export default function SubmitScreen() {
  const [advancedMode, setAdvancedMode] = useState(false);

  // Simple mode fields
  const [amount, setAmount] = useState('1000');
  const [yourBalance, setYourBalance] = useState('1000');
  const [recipientBalance, setRecipientBalance] = useState('500');

  // Advanced mode fields (raw, editable directly)
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

    // In simple mode, calculate realistic after-balances from the natural inputs
    const payload = advancedMode
      ? {
          amount: parseFloat(amount),
          oldbalanceOrg: parseFloat(oldbalanceOrg),
          newbalanceOrig: parseFloat(newbalanceOrig),
          oldbalanceDest: parseFloat(oldbalanceDest),
          newbalanceDest: parseFloat(newbalanceDest),
          is_transfer: isTransfer,
        }
      : {
          amount: parseFloat(amount),
          oldbalanceOrg: parseFloat(yourBalance),
          newbalanceOrig: parseFloat(yourBalance) - parseFloat(amount),
          oldbalanceDest: parseFloat(recipientBalance),
          newbalanceDest: parseFloat(recipientBalance) + parseFloat(amount),
          is_transfer: isTransfer,
        };

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error (${response.status}). Please try again.`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.header}>Send Money</Text>
        <Text style={styles.subheader}>
          Every transfer is automatically checked for fraud
        </Text>

        {!advancedMode ? (
          <>
            <Text style={styles.label}>How much are you sending?</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
            />

            <Text style={styles.label}>Your current balance</Text>
            <TextInput
              style={styles.input}
              value={yourBalance}
              onChangeText={setYourBalance}
              keyboardType="numeric"
              placeholder="0.00"
            />

            <Text style={styles.label}>Recipient's current balance</Text>
            <TextInput
              style={styles.input}
              value={recipientBalance}
              onChangeText={setRecipientBalance}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </>
        ) : (
          <>
            <Text style={styles.advancedNote}>
              Advanced mode: set exact before/after balances to test specific scenarios
            </Text>

            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />

            <Text style={styles.label}>Your balance — before</Text>
            <TextInput style={styles.input} value={oldbalanceOrg} onChangeText={setOldbalanceOrg} keyboardType="numeric" />

            <Text style={styles.label}>Your balance — after</Text>
            <TextInput style={styles.input} value={newbalanceOrig} onChangeText={setNewbalanceOrig} keyboardType="numeric" />

            <Text style={styles.label}>Recipient's balance — before</Text>
            <TextInput style={styles.input} value={oldbalanceDest} onChangeText={setOldbalanceDest} keyboardType="numeric" />

            <Text style={styles.label}>Recipient's balance — after</Text>
            <TextInput style={styles.input} value={newbalanceDest} onChangeText={setNewbalanceDest} keyboardType="numeric" />
          </>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.label}>Advanced mode</Text>
          <Switch value={advancedMode} onValueChange={setAdvancedMode} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Check This Transfer</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingHint}>
            Checking for fraud, this takes a few seconds...
          </Text>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {result && (
          <View style={styles.resultBox}>
            <Text
              style={[
                styles.resultLabel,
                { color: result.predicted_fraud ? '#c0392b' : '#27ae60' },
              ]}
            >
              {result.predicted_fraud
                ? `⚠ Flagged as Suspicious (${(result.fraud_probability * 100).toFixed(0)}% confidence)`
                : '✓ This Transfer Looks Normal'}
            </Text>

            <Text style={styles.sectionTitle}>What Happened</Text>
            <Text style={styles.bodyText}>{result.summary}</Text>

            {result.predicted_fraud === 1 && (
              <>
                <Text style={styles.sectionTitle}>Why It Was Flagged</Text>
                <Markdown style={markdownStyles}>{result.typology_analysis}</Markdown>

                <Text style={styles.sectionTitle}>Official Report</Text>
                <Markdown style={markdownStyles}>{result.sar_draft}</Markdown>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#ffffff' },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#000000' },
  subheader: { fontSize: 13, color: '#666666', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 4, color: '#000000' },
  advancedNote: { fontSize: 12, color: '#888888', fontStyle: 'italic', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#cccccc', borderRadius: 8,
    padding: 12, fontSize: 16, color: '#000000', backgroundColor: '#fafafa',
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 20, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: '#eeeeee',
  },
  button: {
    backgroundColor: '#2c3e50', padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 20,
  },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  loadingHint: { fontSize: 12, color: '#666666', textAlign: 'center', marginTop: 10 },
  errorText: { color: 'red', marginTop: 10, textAlign: 'center' },
  resultBox: { marginTop: 24, padding: 16, backgroundColor: '#f7f7f7', borderRadius: 12 },
  resultLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 14, marginBottom: 4, color: '#000000' },
  bodyText: { fontSize: 13, lineHeight: 19, color: '#333333' },
});

const markdownStyles = {
  body: { fontSize: 13, lineHeight: 19, color: '#333333' },
  heading3: { fontSize: 14, fontWeight: '700' as const, marginTop: 12, marginBottom: 6, color: '#000000' },
  strong: { fontWeight: '700' as const, color: '#000000' },
};