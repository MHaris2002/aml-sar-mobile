import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>AML SAR Assistant</Text>
        <Text style={styles.tagline}>
          AI-powered fraud detection and reporting for financial transactions
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What this app does</Text>
          <Text style={styles.cardBody}>
            This app reviews financial transactions for signs of fraud. When a
            transaction looks suspicious, it explains why in plain language,
            checks it against real financial-crime regulations, and drafts a
            formal report — automatically.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              A machine learning model checks the transaction for patterns
              common in fraud, like an account being fully emptied.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              If flagged, the system searches real regulatory guidance to
              understand what kind of fraud it resembles.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              It drafts a formal Suspicious Activity Report, ready for human
              review.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(tabs)/dashboard')}>
          <Text style={styles.primaryButtonText}>View Flagged Transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(tabs)/submit')}>
          <Text style={styles.secondaryButtonText}>Check a New Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#ffffff' },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, color: '#000000' },
  tagline: { fontSize: 15, color: '#666666', marginTop: 6, marginBottom: 24 },
  card: {
    backgroundColor: '#f7f7f7', borderRadius: 14, padding: 18, marginBottom: 16,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8, color: '#000000' },
  cardBody: { fontSize: 14, lineHeight: 21, color: '#333333' },
  stepRow: { flexDirection: 'row', marginTop: 12, alignItems: 'flex-start' },
  stepNumber: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#2c3e50',
    color: '#ffffff', textAlign: 'center', lineHeight: 24, fontSize: 13,
    fontWeight: 'bold', marginRight: 10,
  },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20, color: '#333333' },
  primaryButton: {
    backgroundColor: '#2c3e50', padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 8,
  },
  primaryButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  secondaryButton: {
    borderWidth: 1.5, borderColor: '#2c3e50', padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 12,
  },
  secondaryButtonText: { color: '#2c3e50', fontWeight: '700', fontSize: 15 },
});