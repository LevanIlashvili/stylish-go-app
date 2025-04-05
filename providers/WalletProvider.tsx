import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthereumWallet } from '../utils/wallet';
import { hasWallet, getWallet, WalletData } from '../utils/storage';
import Toast from 'react-native-toast-message';

type WalletContextType = {
  wallet: EthereumWallet | null;
  ethersWallet: ethers.Wallet | null;
  setWallet: (wallet: EthereumWallet | null) => void;
  isWalletLoaded: boolean;
};

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  ethersWallet: null,
  setWallet: () => {},
  isWalletLoaded: false,
});

export const useWallet = () => useContext(WalletContext);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWalletState] = useState<EthereumWallet | null>(null);
  const [ethersWallet, setEthersWallet] = useState<ethers.Wallet | null>(null);
  const [isWalletLoaded, setIsWalletLoaded] = useState(false);

  const setWallet = (newWallet: EthereumWallet | null) => {
    setWalletState(newWallet);
    if (newWallet) {
      try {
        const recoveredWallet = new ethers.Wallet(newWallet.privateKey);
        setEthersWallet(recoveredWallet);
      } catch (e) {
        setEthersWallet(null);
        Toast.show({ type: 'error', text1: 'Wallet Error', text2: 'Failed to create wallet instance.' });
      }
    } else {
      setEthersWallet(null);
    }
  };

  useEffect(() => {
    async function checkWallet() {
      setIsWalletLoaded(false);
      try {
        const exists = await hasWallet();
        if (exists) {
          const storedWalletData: WalletData | null = await getWallet();
          if (storedWalletData) {
            try {
              const walletData: EthereumWallet = JSON.parse(storedWalletData.encryptedWallet);
              setWalletState(walletData);
              
              const recoveredEthersWallet = new ethers.Wallet(walletData.privateKey);
              setEthersWallet(recoveredEthersWallet);
            } catch (e) {
              Toast.show({ type: 'error', text1: 'Wallet Load Error', text2: 'Failed to load wallet data.' });
              setWalletState(null);
              setEthersWallet(null);
            }
          } else {
             setWalletState(null);
             setEthersWallet(null);
          }
        } else {
          setWalletState(null);
          setEthersWallet(null);
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Storage Error', text2: 'Could not check wallet status.' });
        setWalletState(null);
        setEthersWallet(null);
      } finally {
        setIsWalletLoaded(true);
      }
    }

    checkWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, ethersWallet, setWallet, isWalletLoaded }}>
      {children}
    </WalletContext.Provider>
  );
}