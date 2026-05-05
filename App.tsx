import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './src/components/PrimaryButton';
import { FuelFlowScreen } from './src/screens/FuelFlowScreen';
import { SessionStatusCard } from './src/components/SessionStatusCard';
import { FuelSessionState, SessionInput } from './src/types/session';
import { FuelSessionService } from './src/services/FuelSessionService';

export default function App() {
  const service = useMemo(() => new FuelSessionService(), []);
  const [state, setState] = useState<FuelSessionState>('CREATED');
  const [sessionId, setSessionId] = useState<string>('');

  const startFlow = async (input: SessionInput) => {
    const session = await service.createSession(input);
    setSessionId(session.id);
    setState(session.state);
  };

  const next = async () => {
    if (!sessionId) return;
    const updated = await service.advanceSession(sessionId);
    setState(updated.state);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Mobile Fueling MVP</Text>
        <Text style={styles.subtitle}>Station → Pump → Authorize → Fuel → Receipt</Text>
      </View>

      <FuelFlowScreen onStart={startFlow} />
      <SessionStatusCard state={state} />

      <PrimaryButton
        label={state === 'CLOSED' ? 'Flow Completed' : 'Advance Session'}
        onPress={next}
        disabled={!sessionId || state === 'CLOSED'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F7FB', padding: 16, gap: 16 },
  header: { marginTop: 8, gap: 4 },
  title: { fontSize: 24, fontWeight: '700', color: '#102A43' },
  subtitle: { fontSize: 14, color: '#486581' }
});
