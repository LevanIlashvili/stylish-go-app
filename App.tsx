import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WalletProvider } from './providers';
import { WalletScreen } from './screens/WalletScreen';

export default function App() {
  return (
    <WalletProvider>
      <SafeAreaView style={styles.container}>
        <WalletScreen />
      </SafeAreaView>
    </WalletProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
