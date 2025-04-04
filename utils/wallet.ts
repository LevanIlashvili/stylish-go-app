import 'react-native-get-random-values';
import { ethers } from 'ethers';

export type EthereumWallet = {
  address: string;
  privateKey: string;
  mnemonic: string;
};

export function generateMnemonic(): string {
  const wallet = ethers.Wallet.createRandom();
  return wallet.mnemonic?.phrase || '';
}

export function generateWalletFromMnemonic(mnemonic: string): EthereumWallet {
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: mnemonic
  };
}

export function generateRandomWallet(): EthereumWallet {
  const mnemonic = generateMnemonic();
  return generateWalletFromMnemonic(mnemonic);
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
} 