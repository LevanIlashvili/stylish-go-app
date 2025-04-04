import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { EthereumWallet } from '../utils/wallet';
import { hasWallet } from '../utils/storage';

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
  const [wallet, setWallet] = useState<EthereumWallet | null>(null);
  const [isWalletLoaded, setIsWalletLoaded] = useState(false);

  useEffect(() => {
    async function checkWallet() {
      try {
        const exists = await hasWallet();
        if (exists) {
          setIsWalletLoaded(true);
        } else {
          setIsWalletLoaded(true);
        }
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