import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { WalletProvider, useWallet } from './providers';
import { OnboardingNavigator, GameNavigator } from './navigation';
import { colors } from './config';
import { loadFonts } from './utils/fonts';

function AppContent() {
  const { wallet, isWalletLoaded } = useWallet();

  useEffect(() => {
    console.log('==== APP STATE UPDATE ====');
    console.log('Wallet loaded state:', isWalletLoaded);
    console.log('Wallet exists:', !!wallet);
    if (wallet) {
      console.log('Wallet address:', wallet.address);
      console.log('Should render GameNavigator');
    } else {
      console.log('No wallet, should render OnboardingNavigator');
    }
    console.log('=========================');
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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts:', e);
        setFontsLoaded(true);
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Loading fonts...</Text>
      </View>
    );
  }

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
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 18,
  }
});
