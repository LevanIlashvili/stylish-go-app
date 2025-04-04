import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useWallet } from '../../providers';
import { formatAddress } from '../../utils/wallet';

export function GameMenu() {
  const { wallet, setWallet } = useWallet();

  const handleLogout = () => {
    setWallet(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
      <Text>Menu</Text>
      {wallet && (
        <>
          <Text>Wallet: {formatAddress(wallet.address)}</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
} 