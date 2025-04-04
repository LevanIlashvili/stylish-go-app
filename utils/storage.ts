import * as SecureStore from 'expo-secure-store';

const WALLET_INFO_KEY = 'wallet_info';
const WALLET_EXISTS_KEY = 'wallet_exists';

export interface WalletData {
  address: string;
  encryptedWallet: string;
}

export async function storeWallet(walletData: WalletData): Promise<void> {
  try {
    await SecureStore.setItemAsync(
      WALLET_INFO_KEY,
      JSON.stringify(walletData)
    );
    
    await SecureStore.setItemAsync(WALLET_EXISTS_KEY, 'true');
  } catch (error) {
    throw new Error('Failed to securely store wallet');
  }
}

export async function hasWallet(): Promise<boolean> {
  try {
    const exists = await SecureStore.getItemAsync(WALLET_EXISTS_KEY);
    return exists === 'true';
  } catch (error) {
    return false;
  }
}

export async function getWallet(): Promise<WalletData | null> {
  try {
    const exists = await hasWallet();
    if (!exists) {
      return null;
    }
    const data = await SecureStore.getItemAsync(WALLET_INFO_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as WalletData;
  } catch (error) {
    throw new Error('Failed to retrieve wallet from secure storage');
  }
}

export async function deleteWallet(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(WALLET_INFO_KEY);
    await SecureStore.deleteItemAsync(WALLET_EXISTS_KEY);
  } catch (error) {
    throw new Error('Failed to delete wallet from secure storage');
  }
} 