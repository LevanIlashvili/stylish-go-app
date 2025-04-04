import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWallet } from '../../providers';
import { generateRandomWallet } from '../../utils/wallet';

export function OnboardingScreen() {
  const { setWallet } = useWallet();

  const handleCreateWallet = () => {
    console.log('Creating wallet...');
    const newWallet = generateRandomWallet();
    console.log('Wallet created:', newWallet.address);
    setWallet(newWallet);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleCreateWallet}
      >
        <Text>Create Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#00f7ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
}); 