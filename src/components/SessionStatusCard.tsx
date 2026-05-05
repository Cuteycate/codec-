import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FuelSessionState } from '../types/session';

export function SessionStatusCard({ state }: { state: FuelSessionState }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Current Session State</Text>
      <Text style={styles.value}>{state}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D9E2EC'
  },
  label: { color: '#486581', fontSize: 13 },
  value: { marginTop: 8, color: '#102A43', fontWeight: '700', fontSize: 18 }
});
