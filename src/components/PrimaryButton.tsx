import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.button, disabled && styles.disabled]}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0B63F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  disabled: { backgroundColor: '#9FB3C8' },
  text: { color: 'white', fontWeight: '700', fontSize: 16 }
});
