import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE = 'http://172.20.10.2:8000'; // <-- same IP as your other screens

type LogEntry = {
  id: number;
  ingested_document: string;
  chunks_added: number;
  found: number;
};

export default function KnowledgeScreen() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/knowledge-base/log`)
      .then((res) => res.json())
      .then((data) => {
        setLog(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Knowledge Base Activity</Text>
      <Text style={styles.subheader}>Auto-discovered documents via gap-filling search</Text>
      <FlatList
        data={log}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.docName}>{item.ingested_document}</Text>
            <Text style={styles.chunks}>{item.chunks_added} chunks added</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#000000' },
  subheader: { fontSize: 14, color: '#666666', marginBottom: 10 },
  card: { backgroundColor: '#f2f2f2', padding: 14, borderRadius: 10, marginVertical: 5 },
  docName: { fontSize: 14, fontWeight: '600', color: '#000000' },
  chunks: { fontSize: 12, color: '#555555', marginTop: 4 },
});