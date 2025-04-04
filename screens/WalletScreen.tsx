import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useWallet } from '../providers';
import { generateRandomWallet, formatAddress } from '../utils/wallet';

export function WalletScreen() {
  const { wallet, setWallet } = useWallet();

  const handleCreateWallet = () => {
    const newWallet = generateRandomWallet();
    setWallet(newWallet);
  };

  const handleClearWallet = () => {
    setWallet(null);
  };

  return (
    <View>
      <Text>Wallet Status</Text>
      
      {wallet ? (
        <View>
          <Text>Address:</Text>
          <Text>{formatAddress(wallet.address)}</Text>
          
          <Text>Private Key:</Text>
          <Text>{wallet.privateKey}</Text>
          
          <Text>Mnemonic:</Text>
          <Text>
            {wallet.mnemonic}
          </Text>
          
          <TouchableOpacity onPress={handleClearWallet}>
            <Text>Clear Wallet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text>No wallet created yet</Text>
          <TouchableOpacity onPress={handleCreateWallet}>
            <Text>Create Wallet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
} 