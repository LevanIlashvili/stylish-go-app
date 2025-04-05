import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWallet } from '../../providers';
import { formatAddress } from '../../utils/wallet';
import { deleteWallet } from '../../utils/storage';
import { colors } from '../../config';

export function GameMenu() {
  const { wallet, setWallet } = useWallet();

  const handleLogout = async () => {
    try {
      await deleteWallet(); 
      setWallet(null); 
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      {wallet && (
        <View style={styles.walletInfo}>
          <Text style={styles.walletText}>Wallet: {formatAddress(wallet.address)}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: colors.white,
    marginBottom: 20,
    textShadowColor: colors.secondary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  walletInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  walletText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 20,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
  }
}); 