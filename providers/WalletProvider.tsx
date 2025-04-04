import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EthereumWallet } from '../utils/wallet';

type WalletContextType = {
  wallet: EthereumWallet | null;
  setWallet: (wallet: EthereumWallet | null) => void;
};

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<EthereumWallet | null>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
} 