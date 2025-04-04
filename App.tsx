import React, { useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { WalletProvider, useWallet } from './providers';
import { OnboardingNavigator, GameNavigator } from './navigation';

function AppContent() {
  const { wallet, isWalletLoaded } = useWallet();

  useEffect(() => {
    console.log('Wallet loaded:', isWalletLoaded);
    console.log('Wallet exists:', !!wallet);
  }, [isWalletLoaded, wallet]);

  if (!isWalletLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {wallet ? <GameNavigator /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  }
});
