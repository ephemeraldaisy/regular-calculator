import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function BudgetUI({ onUnlock }) {
  const [searchQuery, setSearchQuery] = useState('');

  const triggerHiddenVault = () => {
    // Hidden Trigger Logic
    if (searchQuery === '2048') {
      onUnlock('2048'); // Passes the master code/token to unlock
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Household Budget</Text>
        {/* Hidden Trigger Button disguised as a setting cog */}
        <TouchableOpacity onPress={triggerHiddenVault} style={styles.settingsBtn}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search expenses or categories..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Balance</Text>
        <Text style={styles.summaryAmount}>$4,250.00</Text>
      </View>

      <ScrollView style={styles.list}>
        {['Groceries: $120.00', 'Utilities: $85.50', 'Internet: $60.00'].map((item, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  searchBar: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#E0E0E0' },
  summaryCard: { backgroundColor: '#4CAF50', padding: 20, borderRadius: 12, marginBottom: 20 },
  summaryTitle: { color: '#FFF', fontSize: 16, opacity: 0.9 },
  summaryAmount: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 8 },
  listItem: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  listText: { fontSize: 16, color: '#333' },
});
