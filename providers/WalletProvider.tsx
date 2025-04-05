import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { EthereumWallet } from '../utils/wallet';
import { hasWallet, getWallet } from '../utils/storage';
import { Alert } from 'react-native';

type WalletContextType = {
  wallet: EthereumWallet | null;
  setWallet: (wallet: EthereumWallet | null) => void;
  isWalletLoaded: boolean;
};

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
  isWalletLoaded: false,
});

export const useWallet = () => useContext(WalletContext);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWalletState] = useState<EthereumWallet | null>(null);
  const [isWalletLoaded, setIsWalletLoaded] = useState(false);

  const setWallet = (newWallet: EthereumWallet | null) => {
    setWalletState(newWallet);
  };

  useEffect(() => {
    async function checkWallet() {
      try {
        const exists = await hasWallet();

        if (exists) {
          const storedWallet = await getWallet();
          
          if (storedWallet) {
            try {
              const walletData = JSON.parse(storedWallet.encryptedWallet) as EthereumWallet;
              setWalletState(walletData);
            } catch (e) {
              console.error("Error parsing wallet data:", e);
            }
          }
        }
        
        setIsWalletLoaded(true);
      } catch (error) {
        console.error('Error checking wallet:', error);
        setIsWalletLoaded(true);
      }
    }

    checkWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, setWallet, isWalletLoaded }}>
      {children}
    </WalletContext.Provider>
  );
} 