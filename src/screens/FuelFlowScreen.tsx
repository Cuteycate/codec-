import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SessionInput } from '../types/session';

interface Props {
  onStart: (input: SessionInput) => Promise<void>;
}

export function FuelFlowScreen({ onStart }: Props) {
  const [stationId, setStationId] = useState('st_001');
  const [pumpId, setPumpId] = useState('p_08');
  const [limitValue, setLimitValue] = useState('70');

  const handleStart = async () => {
    await onStart({
      stationId,
      pumpId,
      fuelGrade: 'GASOLINE_95',
      limitValue: Number(limitValue)
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Start Fuel Session</Text>
      <TextInput value={stationId} onChangeText={setStationId} placeholder="Station ID" style={styles.input} />
      <TextInput value={pumpId} onChangeText={setPumpId} placeholder="Pump ID" style={styles.input} />
      <TextInput
        value={limitValue}
        onChangeText={setLimitValue}
        placeholder="Limit (USD)"
        keyboardType="numeric"
        style={styles.input}
      />
      <PrimaryButton label="Create Session" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    padding: 16,
    gap: 10
  },
  title: { fontSize: 18, fontWeight: '700', color: '#102A43' },
  input: {
    borderWidth: 1,
    borderColor: '#BCCCDC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  }
});
