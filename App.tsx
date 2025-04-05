import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { WalletProvider, useWallet } from './providers';
import { OnboardingNavigator, GameNavigator } from './navigation';
import { colors } from './config';
import { loadFonts } from './utils/fonts';
import { toastConfig } from './config/toast';

function AppContent() {
  const { wallet, isWalletLoaded } = useWallet();

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
      <Toast config={toastConfig} />
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
